import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weekdayShort } from "../lib/format";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs shadow-raised dark:border-ink-700 dark:bg-ink-800">
      <p className="mb-0.5 font-medium text-ink-700 dark:text-ink-200">{weekdayShort(label)}</p>
      <p className="text-moss-600 dark:text-moss-400">{payload[0].value} kcal</p>
    </div>
  );
}

export default function TrendChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="calorieFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f7a5c" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1f7a5c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-ink-100 dark:stroke-ink-700" />
          <XAxis
            dataKey="date"
            tickFormatter={weekdayShort}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-ink-400"
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor" }} className="text-ink-400" width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="calories"
            stroke="#1f7a5c"
            strokeWidth={2.5}
            fill="url(#calorieFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
