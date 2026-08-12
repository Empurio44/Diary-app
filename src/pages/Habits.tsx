import { useState } from "react";
import PageHeader from "../components/PageHeader";
import HabitHeatmap from "../components/HabitHeatmap";
import { useStats } from "../store/StatsContext";
import { currentStreak, longestStreak, todayISO } from "../utils/date";
import { seriesColor } from "../theme";
import styles from "./Habits.module.css";

export default function Habits() {
  const { state, dispatch } = useStats();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("\u{2705}");
  const today = todayISO();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: "habit/add", name: name.trim(), emoji });
    setName("");
    setEmoji("\u{2705}");
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader title="Habits" subtitle="Check off today, watch the streak grow." />
      <div className={styles.list}>
        {state.habits.map((habit) => {
          const doneToday = habit.completions.includes(today);
          const streak = currentStreak(habit.completions);
          const best = longestStreak(habit.completions);
          const color = seriesColor(habit.colorSlot);
          return (
            <div className={`card ${styles.habitCard}`} key={habit.id}>
              <div className={styles.info}>
                <span className={styles.emoji}>{habit.emoji}</span>
                <div>
                  <div className={styles.name}>{habit.name}</div>
                  <div className={styles.streak}>
                    {streak > 0 ? `${streak} day streak` : "No active streak"} &middot; best {best}
                  </div>
                </div>
              </div>

              <div className={styles.heatmapWrap}>
                <HabitHeatmap completions={habit.completions} colorSlot={habit.colorSlot} />
              </div>

              <button
                type="button"
                className={`btn ${styles.toggle}`}
                style={{
                  background: doneToday ? color : undefined,
                  borderColor: doneToday ? "transparent" : undefined,
                  color: doneToday ? "#fff" : undefined,
                }}
                onClick={() => dispatch({ type: "habit/toggleToday", id: habit.id })}
              >
                {doneToday ? "✓ Done today" : "Mark today"}
              </button>
            </div>
          );
        })}

        <div className={`card ${styles.addCard}`}>
          {showForm ? (
            <form className={styles.addForm} onSubmit={handleAdd}>
              <input
                className={`input ${styles.emojiInput}`}
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                aria-label="Emoji"
              />
              <input
                className={`input ${styles.nameInput}`}
                placeholder="Habit name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btnPrimary">
                Add habit
              </button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <button type="button" className="btn" onClick={() => setShowForm(true)}>
              + New habit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
