import type { ReactNode } from "react";
import styles from "./StatTile.module.css";

interface StatTileProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: { text: string; tone: "good" | "bad" | "neutral" };
}

const deltaClass = {
  good: styles.deltaGood,
  bad: styles.deltaBad,
  neutral: styles.deltaNeutral,
};

export default function StatTile({ label, value, unit, delta }: StatTileProps) {
  return (
    <div className={`card ${styles.tile}`}>
      <span className={styles.label}>{label}</span>
      <span>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
      {delta && <span className={`${styles.delta} ${deltaClass[delta.tone]}`}>{delta.text}</span>}
    </div>
  );
}
