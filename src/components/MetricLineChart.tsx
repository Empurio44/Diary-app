import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatShortDate } from "../utils/date";
import { seriesColor } from "../theme";
import styles from "./MetricLineChart.module.css";

interface Point {
  date: string;
  value: number;
}

interface MetricLineChartProps {
  data: Point[];
  colorSlot: number;
  unit: string;
}

function makeTooltip(unit: string) {
  return function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: Point }[] }) {
    if (!active || !payload || payload.length === 0) return null;
    const point = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipDate}>{formatShortDate(point.date)}</div>
        <div className={styles.tooltipValue}>
          {payload[0].value} {unit}
        </div>
      </div>
    );
  };
}

export default function MetricLineChart({ data, colorSlot, unit }: MetricLineChartProps) {
  const color = seriesColor(colorSlot);
  const CustomTooltip = makeTooltip(unit);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
          minTickGap={28}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={46}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: color, stroke: "var(--surface-1)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
