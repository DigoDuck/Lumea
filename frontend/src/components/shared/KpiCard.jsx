export default function KpiCard({ title, value, change, Icon: accent }) {
  const isPositive = change >= 0;

  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-black/40 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent || "bg-black/10"}`}
        >
          <Icon size={16} className="text-black/70" />
        </div>
      </div>
      <p className="text-2xl font-bold text-black">{value}</p>
      {change !== undefined && (
        <p
          className={`text-xs font-medium flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-red-500"}`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% vs. mês
          anterior
        </p>
      )}
    </div>
  );
}
