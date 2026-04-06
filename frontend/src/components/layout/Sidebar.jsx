import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  BrainCircuit,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/wallets", icon: Wallet, label: "Carteiras" },
  { to: "/transactions", icon: FileText, label: "Relatórios" },
  { to: "/ai", icon: BrainCircuit, label: "IA Analista" },
  { to: "/settings", icon: Settings, label: "Configurações" },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="w-64 h-screen bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col px-4 py-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center">
          <BrainCircuit size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white leading-none">Lumea</p>
          <p className="text-xs text-white/40">AI Finance</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* AI do Mês — destaque */}
      <div className="glass-card p-4 mb-4 bg-gradient-to-br from-violet-600/20 to-violet-900/20 border-violet-500/20">
        <div className="flex items-center gap-2 mb-1">
          <BrainCircuit size={14} className="text-violet-400" />
          <span className="text-xs font-semibold text-violet-400">
            IA do Mês
          </span>
        </div>
        <p className="text-xs text-white/60">
          Acesse análises personalizadas do seu perfil financeiro.
        </p>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/30 hover:text-white/70 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
