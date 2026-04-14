export default function KpiCard({ title, value, change, icon: Icon, accent }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent || "bg-zinc-100 text-zinc-600"}`}
        >
          {Icon && <Icon size={16} />}
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      {change !== undefined && (
        <p
          className={`text-xs font-medium flex items-center gap-1 ${isPositive ? "text-emerald-600" : "text-red-500"}`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% vs. mês
          anterior
        </p>
      )}
    </div>
  );
}