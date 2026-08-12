import type { StatsState } from "../types";
import { daysAgoISO } from "../utils/date";

function uid(prefix: string, i: number): string {
  return `${prefix}-${i}`;
}

export function buildSeedState(): StatsState {
  const counters: StatsState["counters"] = [
    { id: uid("c", 1), name: "Coffees", emoji: "☕", count: 3, step: 1, colorSlot: 2 },
    { id: uid("c", 2), name: "Workouts this week", emoji: "\u{1F3CB}", count: 2, step: 1, colorSlot: 1 },
    { id: uid("c", 3), name: "Books read this year", emoji: "\u{1F4DA}", count: 11, step: 1, colorSlot: 7 },
    { id: uid("c", 4), name: "Glasses of water today", emoji: "\u{1F4A7}", count: 5, step: 1, colorSlot: 3 },
  ];

  const habits: StatsState["habits"] = [
    {
      id: uid("h", 1),
      name: "Meditate",
      emoji: "\u{1F9D8}",
      colorSlot: 7,
      completions: [daysAgoISO(0), daysAgoISO(1), daysAgoISO(2), daysAgoISO(4), daysAgoISO(5), daysAgoISO(6), daysAgoISO(7), daysAgoISO(8)],
    },
    {
      id: uid("h", 2),
      name: "No sugar",
      emoji: "\u{1F36C}",
      colorSlot: 3,
      completions: [daysAgoISO(1), daysAgoISO(2), daysAgoISO(3), daysAgoISO(5), daysAgoISO(9), daysAgoISO(10)],
    },
    {
      id: uid("h", 3),
      name: "Read 20 min",
      emoji: "\u{1F4D6}",
      colorSlot: 4,
      completions: [daysAgoISO(0), daysAgoISO(1), daysAgoISO(2), daysAgoISO(3), daysAgoISO(4), daysAgoISO(6), daysAgoISO(8), daysAgoISO(11)],
    },
  ];

  const metrics: StatsState["metrics"] = [
    { id: uid("m", 1), name: "Weight", unit: "kg", colorSlot: 1, lowerIsBetter: false },
    { id: uid("m", 2), name: "Sleep", unit: "hrs", colorSlot: 3, lowerIsBetter: false },
    { id: uid("m", 3), name: "Steps", unit: "steps", colorSlot: 4, lowerIsBetter: false },
  ];

  const weightBase = 78;
  const sleepBase = 7;
  const stepsBase = 7000;
  const logEntries: StatsState["logEntries"] = [];
  for (let i = 13; i >= 0; i--) {
    const date = daysAgoISO(i);
    logEntries.push({
      id: uid("le-w", i),
      metricId: metrics[0].id,
      date,
      value: Math.round((weightBase - i * 0.05 + Math.sin(i) * 0.4) * 10) / 10,
    });
    logEntries.push({
      id: uid("le-s", i),
      metricId: metrics[1].id,
      date,
      value: Math.round((sleepBase + Math.sin(i * 1.3) * 1.2) * 10) / 10,
    });
    logEntries.push({
      id: uid("le-st", i),
      metricId: metrics[2].id,
      date,
      value: Math.max(1500, Math.round(stepsBase + Math.cos(i) * 2500)),
    });
  }

  const diaryEntries: StatsState["diaryEntries"] = [
    { id: uid("d", 1), date: daysAgoISO(0), mood: "good", text: "Solid day. Shipped the thing I'd been putting off and went for a walk after dinner." },
    { id: uid("d", 2), date: daysAgoISO(1), mood: "great", text: "Caught up with an old friend, long overdue. Feeling recharged." },
    { id: uid("d", 3), date: daysAgoISO(3), mood: "okay", text: "Nothing special, steady work day. Slept a little late." },
    { id: uid("d", 4), date: daysAgoISO(5), mood: "low", text: "Rough night of sleep caught up with me. Kept things simple." },
    { id: uid("d", 5), date: daysAgoISO(8), mood: "good", text: "Good workout this morning, felt strong." },
  ];

  return { counters, habits, metrics, logEntries, diaryEntries };
}
