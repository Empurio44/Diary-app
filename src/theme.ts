import type { Mood } from "./types";

export function seriesColor(slot: number): string {
  const n = ((slot - 1) % 8) + 1;
  return `var(--series-${n})`;
}

/** Ordinal ramp, rough -> great, single hue stepped (never lighter than the 2:1 floor) */
const MOOD_RAMP: Record<Mood, string> = {
  rough: "var(--seq-250)",
  low: "var(--seq-350)",
  okay: "var(--seq-450)",
  good: "var(--seq-550)",
  great: "var(--seq-650)",
};

export function moodColor(mood: Mood): string {
  return MOOD_RAMP[mood];
}
