# Life Stats

A frontend for tracking stats about your life: quick-tap counters, daily habit
streaks, numeric logs (weight, sleep, steps, ...) charted over time, and a
mood-tagged diary.

Built with React, TypeScript, Vite, React Router, and Recharts. Data lives in
memory for this session (seeded with sample data) — nothing persists yet.

## Getting started

```bash
npm install
npm run dev
```

## Pages

- **Dashboard** — an at-a-glance overview across all four sections.
- **Counters** — tap-to-increment counters for anything you'd otherwise lose count of.
- **Habits** — daily check-offs with current/best streaks and a completion heatmap.
- **Logs** — numeric metrics (weight, sleep, steps, ...) logged over time and charted.
- **Diary** — short journal entries tagged with a mood, plus a mood distribution view.
