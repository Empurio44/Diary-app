import { MOOD_EMOJI, MOOD_LABEL, MOOD_ORDER, type DiaryEntry } from "../types";
import { moodColor } from "../theme";
import styles from "./MoodDistribution.module.css";

interface MoodDistributionProps {
  entries: DiaryEntry[];
}

export default function MoodDistribution({ entries }: MoodDistributionProps) {
  const counts = MOOD_ORDER.map((mood) => entries.filter((e) => e.mood === mood).length);
  const max = Math.max(1, ...counts);

  return (
    <div className={styles.rows}>
      {MOOD_ORDER.map((mood, i) => (
        <div className={styles.row} key={mood}>
          <span className={styles.rowLabel}>
            <span>{MOOD_EMOJI[mood]}</span>
            {MOOD_LABEL[mood]}
          </span>
          <span className={styles.track}>
            <span
              className={styles.fill}
              style={{ width: `${(counts[i] / max) * 100}%`, background: moodColor(mood) }}
            />
          </span>
          <span className={styles.count}>{counts[i]}</span>
        </div>
      ))}
    </div>
  );
}
