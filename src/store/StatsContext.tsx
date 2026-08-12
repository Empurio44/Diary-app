import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { Counter, DiaryEntry, Habit, LogEntry, LogUnit, Mood, StatsState } from "../types";
import { buildSeedState } from "../data/seed";
import { todayISO } from "../utils/date";

type Action =
  | { type: "counter/adjust"; id: string; delta: number }
  | { type: "counter/add"; name: string; emoji: string }
  | { type: "habit/toggleToday"; id: string }
  | { type: "habit/add"; name: string; emoji: string }
  | { type: "log/addEntry"; metricId: string; value: number; date?: string }
  | { type: "log/addMetric"; name: string; unit: LogUnit }
  | { type: "diary/add"; mood: Mood; text: string };

function nextColorSlot(existingCount: number): number {
  return (existingCount % 8) + 1;
}

function reducer(state: StatsState, action: Action): StatsState {
  switch (action.type) {
    case "counter/adjust": {
      const counters = state.counters.map((c: Counter) =>
        c.id === action.id ? { ...c, count: Math.max(0, c.count + action.delta) } : c
      );
      return { ...state, counters };
    }
    case "counter/add": {
      const counter: Counter = {
        id: `c-${Date.now()}`,
        name: action.name,
        emoji: action.emoji || "\u{1F522}",
        count: 0,
        step: 1,
        colorSlot: nextColorSlot(state.counters.length),
      };
      return { ...state, counters: [...state.counters, counter] };
    }
    case "habit/toggleToday": {
      const today = todayISO();
      const habits = state.habits.map((h: Habit) => {
        if (h.id !== action.id) return h;
        const has = h.completions.includes(today);
        return {
          ...h,
          completions: has ? h.completions.filter((d) => d !== today) : [...h.completions, today],
        };
      });
      return { ...state, habits };
    }
    case "habit/add": {
      const habit: Habit = {
        id: `h-${Date.now()}`,
        name: action.name,
        emoji: action.emoji || "\u{2705}",
        colorSlot: nextColorSlot(state.habits.length),
        completions: [],
      };
      return { ...state, habits: [...state.habits, habit] };
    }
    case "log/addEntry": {
      const entry: LogEntry = {
        id: `le-${Date.now()}`,
        metricId: action.metricId,
        date: action.date ?? todayISO(),
        value: action.value,
      };
      return { ...state, logEntries: [...state.logEntries, entry] };
    }
    case "log/addMetric": {
      const metric = {
        id: `m-${Date.now()}`,
        name: action.name,
        unit: action.unit,
        colorSlot: nextColorSlot(state.metrics.length),
        lowerIsBetter: false,
      };
      return { ...state, metrics: [...state.metrics, metric] };
    }
    case "diary/add": {
      const entry: DiaryEntry = {
        id: `d-${Date.now()}`,
        date: todayISO(),
        mood: action.mood,
        text: action.text,
      };
      return { ...state, diaryEntries: [entry, ...state.diaryEntries] };
    }
    default:
      return state;
  }
}

interface StatsContextValue {
  state: StatsState;
  dispatch: React.Dispatch<Action>;
}

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildSeedState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats(): StatsContextValue {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatsProvider");
  return ctx;
}
