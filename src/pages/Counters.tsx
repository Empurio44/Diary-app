import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useStats } from "../store/StatsContext";
import { seriesColor } from "../theme";
import styles from "./Counters.module.css";

export default function Counters() {
  const { state, dispatch } = useStats();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("\u{2B50}");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: "counter/add", name: name.trim(), emoji });
    setName("");
    setEmoji("\u{2B50}");
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader
        title="Counters"
        subtitle="Tap to track anything you'd otherwise lose count of."
      />
      <div className={`grid ${styles.grid}`}>
        {state.counters.map((counter) => (
          <div className={`card ${styles.counterCard}`} key={counter.id}>
            <div className={styles.top}>
              <span className={styles.emoji}>{counter.emoji}</span>
              <span className={styles.name}>{counter.name}</span>
            </div>
            <span className={styles.count} style={{ color: seriesColor(counter.colorSlot) }}>
              {counter.count}
            </span>
            <div className={styles.controls}>
              <button
                type="button"
                className="iconBtn"
                aria-label={`Decrease ${counter.name}`}
                onClick={() => dispatch({ type: "counter/adjust", id: counter.id, delta: -counter.step })}
              >
                &minus;
              </button>
              <button
                type="button"
                className="iconBtn"
                aria-label={`Increase ${counter.name}`}
                onClick={() => dispatch({ type: "counter/adjust", id: counter.id, delta: counter.step })}
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className={`card ${styles.addCard}`}>
          {showForm ? (
            <form className={styles.addForm} onSubmit={handleAdd}>
              <div className={styles.addRow}>
                <input
                  className={`input ${styles.emojiInput}`}
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={2}
                  aria-label="Emoji"
                />
                <input
                  className="input"
                  placeholder="Counter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className={styles.addRow}>
                <button type="submit" className="btn btnPrimary">
                  Add counter
                </button>
                <button type="button" className="btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="btn" onClick={() => setShowForm(true)}>
              + New counter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
