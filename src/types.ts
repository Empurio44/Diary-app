export interface Counter {
  id: string;
  name: string;
  emoji: string;
  count: number;
  step: number;
  colorSlot: number;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  colorSlot: number;
  /** ISO date strings (YYYY-MM-DD) the habit was completed on */
  completions: string[];
}

export type LogUnit = "kg" | "lb" | "hrs" | "min" | "glasses" | "pages" | "steps" | "%";

export interface LogMetric {
  id: string;
  name: string;
  unit: LogUnit;
  colorSlot: number;
  /** lower values reading as "better" flips trend-arrow color logic (e.g. resting heart rate) */
  lowerIsBetter: boolean;
}

export interface LogEntry {
  id: string;
  metricId: string;
  date: string; // ISO date
  value: number;
}

export type Mood = "rough" | "low" | "okay" | "good" | "great";

export const MOOD_ORDER: Mood[] = ["rough", "low", "okay", "good", "great"];

export const MOOD_LABEL: Record<Mood, string> = {
  rough: "Rough",
  low: "Low",
  okay: "Okay",
  good: "Good",
  great: "Great",
};

export const MOOD_EMOJI: Record<Mood, string> = {
  rough: "\u{1F62B}",
  low: "\u{1F615}",
  okay: "\u{1F610}",
  good: "\u{1F642}",
  great: "\u{1F60A}",
};

export interface DiaryEntry {
  id: string;
  date: string; // ISO date
  mood: Mood;
  text: string;
}

export interface StatsState {
  counters: Counter[];
  habits: Habit[];
  metrics: LogMetric[];
  logEntries: LogEntry[];
  diaryEntries: DiaryEntry[];
}
