import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatTile from "../components/StatTile";
import MetricLineChart from "../components/MetricLineChart";
import MoodDistribution from "../components/MoodDistribution";
import { useStats } from "../store/StatsContext";
import { currentStreak, daysAgoISO, todayISO } from "../utils/date";
import { seriesColor } from "../theme";
import { MOOD_EMOJI } from "../types";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { state } = useStats();
  const today = todayISO();
  const weekAgo = daysAgoISO(6);

  const habitsDoneToday = state.habits.filter((h) => h.completions.includes(today)).length;
  const bestStreakHabit = [...state.habits].sort(
    (a, b) => currentStreak(b.completions) - currentStreak(a.completions)
  )[0];

  const weekEntries = state.diaryEntries.filter((e) => e.date >= weekAgo);
  const moodCounts = new Map<string, number>();
  for (const e of weekEntries) moodCounts.set(e.mood, (moodCounts.get(e.mood) ?? 0) + 1);
  const topMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  const primaryMetric = state.metrics[0];
  const primaryPoints = primaryMetric
    ? state.logEntries
        .filter((e) => e.metricId === primaryMetric.id)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => ({ date: e.date, value: e.value }))
    : [];
  const latest = primaryPoints[primaryPoints.length - 1];
  const previous = primaryPoints[primaryPoints.length - 2];
  let metricDelta: { text: string; tone: "good" | "bad" | "neutral" } | undefined;
  if (latest && previous && primaryMetric) {
    const diff = Math.round((latest.value - previous.value) * 10) / 10;
    const improved = primaryMetric.lowerIsBetter ? diff < 0 : diff > 0;
    const tone = diff === 0 ? "neutral" : improved ? "good" : "bad";
    const arrow = diff === 0 ? "→" : diff > 0 ? "↑" : "↓";
    metricDelta = { text: `${arrow} ${Math.abs(diff)} ${primaryMetric.unit} vs last entry`, tone };
  }

  const totalTaps = state.counters.reduce((sum, c) => sum + c.count, 0);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your life, at a glance." />

      <div className={`grid ${styles.tiles}`}>
        <StatTile
          label="Habits today"
          value={`${habitsDoneToday}/${state.habits.length}`}
        />
        <StatTile
          label="Best streak"
          value={bestStreakHabit ? currentStreak(bestStreakHabit.completions) : 0}
          unit={bestStreakHabit ? `days · ${bestStreakHabit.name}` : undefined}
        />
        <StatTile
          label={primaryMetric ? `Latest ${primaryMetric.name.toLowerCase()}` : "Latest log"}
          value={latest ? latest.value : "—"}
          unit={primaryMetric?.unit}
          delta={metricDelta}
        />
        <StatTile
          label="Diary entries this week"
          value={weekEntries.length}
          unit={topMood ? `${MOOD_EMOJI[topMood as keyof typeof MOOD_EMOJI]} mostly` : undefined}
        />
      </div>

      <div className={`grid ${styles.sections}`}>
        <div className={`card ${styles.sectionCard}`}>
          <div className={styles.sectionHead}>
            <span className="sectionTitle">Habits</span>
            <Link to="/habits" className={styles.link}>
              View all
            </Link>
          </div>
          {state.habits.map((h) => (
            <div className={styles.habitRow} key={h.id}>
              <span className={styles.habitName}>
                <span>{h.emoji}</span>
                {h.name}
              </span>
              <span className={styles.habitStreak}>{currentStreak(h.completions)}d streak</span>
            </div>
          ))}
        </div>

        <div className={`card ${styles.sectionCard}`}>
          <div className={styles.sectionHead}>
            <span className="sectionTitle">{primaryMetric ? primaryMetric.name : "Logs"}</span>
            <Link to="/logs" className={styles.link}>
              View all
            </Link>
          </div>
          {primaryMetric && primaryPoints.length > 0 ? (
            <MetricLineChart data={primaryPoints} colorSlot={primaryMetric.colorSlot} unit={primaryMetric.unit} />
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No entries yet.</p>
          )}
        </div>

        <div className={`card ${styles.sectionCard}`}>
          <div className={styles.sectionHead}>
            <span className="sectionTitle">Mood, last 7 days</span>
            <Link to="/diary" className={styles.link}>
              View all
            </Link>
          </div>
          <MoodDistribution entries={weekEntries} />
        </div>

        <div className={`card ${styles.sectionCard}`}>
          <div className={styles.sectionHead}>
            <span className="sectionTitle">Counters</span>
            <Link to="/counters" className={styles.link}>
              View all
            </Link>
          </div>
          {state.counters.map((c) => (
            <div className={styles.counterRow} key={c.id}>
              <span className={styles.counterName}>
                <span>{c.emoji}</span>
                {c.name}
              </span>
              <span className={styles.counterValue} style={{ color: seriesColor(c.colorSlot) }}>
                {c.count}
              </span>
            </div>
          ))}
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>{totalTaps} total across all counters</p>
        </div>
      </div>
    </div>
  );
}
