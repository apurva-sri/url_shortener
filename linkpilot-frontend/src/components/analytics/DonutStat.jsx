import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#6366F1", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"];

function normalize(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((r) => ({ name: r.name ?? r.label, value: r.count ?? r.value ?? 0 }));
  }
  return Object.entries(raw).map(([name, value]) => ({ name, value }));
}

export default function DonutStat({ title, data }) {
  const chartData = normalize(data);
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>

      {chartData.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate">No data yet</p>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <div className="h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={32}
                  outerRadius={52}
                  paddingAngle={2}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex-1 space-y-1.5">
            {chartData.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-medium text-ink">
                  {total ? Math.round((d.value / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
