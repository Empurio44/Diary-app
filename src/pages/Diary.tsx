import { useState } from "react";
import PageHeader from "../components/PageHeader";
import MoodDistribution from "../components/MoodDistribution";
import { useStats } from "../store/StatsContext";
import { MOOD_EMOJI, MOOD_LABEL, MOOD_ORDER, type Mood } from "../types";
import { formatShortDate } from "../utils/date";
import { moodColor } from "../theme";
import styles from "./Diary.module.css";

export default function Diary() {
  const { state, dispatch } = useStats();
  const [mood, setMood] = useState<Mood>("okay");
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "diary/add", mood, text: text.trim() });
    setText("");
  }

  const sorted = [...state.diaryEntries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader title="Diary" subtitle="A line or two a day, tagged with how it felt." />

      <div className={styles.layout}>
        <div>
          <form className={`card ${styles.composer}`} onSubmit={handleSubmit}>
            <div className={styles.moodPicker}>
              {MOOD_ORDER.map((m) => {
                const active = mood === m;
                return (
                  <button
                    type="button"
                    key={m}
                    className="pill"
                    style={
                      active
                        ? { background: moodColor(m), borderColor: "transparent", color: "#fff" }
                        : undefined
                    }
                    onClick={() => setMood(m)}
                  >
                    <span>{MOOD_EMOJI[m]}</span>
                    {MOOD_LABEL[m]}
                  </button>
                );
              })}
            </div>
            <textarea
              className="textarea"
              placeholder="What happened today?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div>
              <button type="submit" className="btn btnPrimary">
                Save entry
              </button>
            </div>
          </form>

          <div className={styles.entries}>
            {sorted.map((entry) => (
              <div className={`card ${styles.entry}`} key={entry.id}>
                <span className={styles.entryEmoji}>{MOOD_EMOJI[entry.mood]}</span>
                <div>
                  <div className={styles.entryDate}>{formatShortDate(entry.date)}</div>
                  <div className={styles.entryText}>{entry.text}</div>
                </div>
              </div>
            ))}
            {sorted.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No entries yet — write your first one above.</p>
            )}
          </div>
        </div>

        <div>
          <div className={`card ${styles.sideCard}`}>
            <div className="sectionTitle" style={{ marginBottom: 14 }}>
              Mood distribution
            </div>
            <MoodDistribution entries={state.diaryEntries} />
          </div>
        </div>
      </div>
    </div>
  );
}
