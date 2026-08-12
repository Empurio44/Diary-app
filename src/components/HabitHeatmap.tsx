import { lastNDays, todayISO } from "../utils/date";
import { seriesColor } from "../theme";
import styles from "./HabitHeatmap.module.css";

interface HabitHeatmapProps {
  completions: string[];
  colorSlot: number;
  days?: number;
}

export default function HabitHeatmap({ completions, colorSlot, days = 70 }: HabitHeatmapProps) {
  const completedSet = new Set(completions);
  const dates = lastNDays(days);
  const today = todayISO();
  const color = seriesColor(colorSlot);

  return (
    <div className={styles.grid} role="img" aria-label={`Completion history for the last ${days} days`}>
      {dates.map((date) => {
        const done = completedSet.has(date);
        return (
          <div
            key={date}
            title={date}
            className={`${styles.cell} ${date === today ? styles.cellToday : ""}`}
            style={done ? { background: color } : undefined}
          />
        );
      })}
    </div>
  );
}
