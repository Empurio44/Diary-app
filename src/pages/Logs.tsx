import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import MetricLineChart from "../components/MetricLineChart";
import { useStats } from "../store/StatsContext";
import type { LogUnit } from "../types";
import styles from "./Logs.module.css";

const UNITS: LogUnit[] = ["kg", "lb", "hrs", "min", "glasses", "pages", "steps", "%"];

export default function Logs() {
  const { state, dispatch } = useStats();
  const [entryMetricId, setEntryMetricId] = useState(state.metrics[0]?.id ?? "");
  const [entryValue, setEntryValue] = useState("");
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [metricName, setMetricName] = useState("");
  const [metricUnit, setMetricUnit] = useState<LogUnit>("kg");

  const seriesByMetric = useMemo(() => {
    const map = new Map<string, { date: string; value: number }[]>();
    for (const metric of state.metrics) {
      const points = state.logEntries
        .filter((e) => e.metricId === metric.id)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => ({ date: e.date, value: e.value }));
      map.set(metric.id, points);
    }
    return map;
  }, [state.metrics, state.logEntries]);

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(entryValue);
    if (!entryMetricId || Number.isNaN(value)) return;
    dispatch({ type: "log/addEntry", metricId: entryMetricId, value });
    setEntryValue("");
  }

  function handleAddMetric(e: React.FormEvent) {
    e.preventDefault();
    if (!metricName.trim()) return;
    dispatch({ type: "log/addMetric", name: metricName.trim(), unit: metricUnit });
    setMetricName("");
    setShowMetricForm(false);
  }

  return (
    <div>
      <PageHeader title="Logs" subtitle="Track numbers over time — weight, sleep, steps, whatever you measure." />

      <div className={`grid ${styles.grid}`}>
        {state.metrics.map((metric) => {
          const points = seriesByMetric.get(metric.id) ?? [];
          const latest = points[points.length - 1];
          return (
            <div className={`card ${styles.metricCard}`} key={metric.id}>
              <div className={styles.metricHead}>
                <span className={styles.metricName}>{metric.name}</span>
                {latest && (
                  <span className={styles.metricLatest}>
                    latest <span className={styles.metricLatestValue}>{latest.value}</span> {metric.unit}
                  </span>
                )}
              </div>
              {points.length > 0 ? (
                <MetricLineChart data={points} colorSlot={metric.colorSlot} unit={metric.unit} />
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No entries yet.</p>
              )}
            </div>
          );
        })}
      </div>

      <div className={`card ${styles.addSection}`}>
        <div className="sectionTitle" style={{ marginBottom: 12 }}>
          Log an entry
        </div>
        <form className={styles.addForm} onSubmit={handleAddEntry}>
          <select
            className={`select ${styles.select}`}
            value={entryMetricId}
            onChange={(e) => setEntryMetricId(e.target.value)}
          >
            {state.metrics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.unit})
              </option>
            ))}
          </select>
          <input
            className={`input ${styles.valueInput}`}
            type="number"
            step="any"
            placeholder="Value"
            value={entryValue}
            onChange={(e) => setEntryValue(e.target.value)}
          />
          <button type="submit" className="btn btnPrimary">
            Add entry
          </button>
        </form>

        {showMetricForm ? (
          <form className={styles.addForm} onSubmit={handleAddMetric} style={{ marginTop: 14 }}>
            <input
              className={`input ${styles.select}`}
              placeholder="New metric name"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              autoFocus
            />
            <select
              className={`select ${styles.valueInput}`}
              value={metricUnit}
              onChange={(e) => setMetricUnit(e.target.value as LogUnit)}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btnPrimary">
              Create metric
            </button>
            <button type="button" className="btn" onClick={() => setShowMetricForm(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button type="button" className="btn" style={{ marginTop: 14 }} onClick={() => setShowMetricForm(true)}>
            + Track a new metric
          </button>
        )}
      </div>
    </div>
  );
}
