import { useEffect, useState } from "react";
import { DollarSign,CreditCard,TrendingUp,MoonStar,Plus, BrainCircuit } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart,Bar, PieChart, Pie, Cell,Legend
} from "recharts";
import KpiCard from "@/components/shared/KpiCard";
import { transactionsApi } from "@/api/transactions";
import { walletsApi } from "@/api/wallets";
import { aiApi } from "@/api/ai";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

const COLORS = ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981", "#EF4444"];

export default function Dashboard() {
    const { user } = useAuthStore();
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [wRes, tRes, iRes] = await Promise.all([
                    walletsApi.list(),
                    transactionsApi.list(),
                    aiApi.getInsight(),
                ]);
                setWallets(wRes.data);
                setTransactions(tRes.data);
                setInsight(iRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [])

    // Cálculos dos KPIs
    const totalBalance = wallets.reduce((s, w) => s + parseFloat(w.balance), 0);
    const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalExpenses = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + parseFloat(t.amount), 0);

    // Dados para o gráfico de fluxo de caixa
    const cashFlowData = (() => {
        const map = {};
        transactions.forEach((t) => {
            const d = new Date(t.date);
            const label = d.toLocaleString("pt-BR", { month: "short"});
            if (!map[label]) map[label] = { month: label, Entradas: 0, Saídas: 0};
            if (t.type === "INCOME") map[label].Entradas += parseFloat(t.amount);
            if (t.type === "EXPENSE") map[label].Saídas += parseFloat(t.amount);
        });
        return Object.values(map).slice(-4);
    })();

    // Categorias
    const categoryData = Object.values(
        transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((acc, t) => {
            const key = t.category;
            if (!acc[key]) acc[key] = {name: key, value: 0};
            acc[key].value += parseFloat(t.amount);
            return acc;
        }, {})
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"/>
            </div>
        );
    }

    const fmt = (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2})}`;
    const insightItems = insight?.summary_text?.split("|") || [];

    return (
        <div className="space-y-6">
            {/*Header*/}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-black/80 text-sm">Bem-vindo de volta</p>
                    <h1 className="text-2l font-bold text-black mt-0.5">Dashboard Financeiro com IA</h1>
                    <p className="text-black/80 text-sm mt-1">Acompanhe seus gastos, metas e recomendações automáticas</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-black/20 text-black/60 hover:text-black hover:bg-black/10">
                        Buscar
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30">
                        <Plus size={16} /> Novo Lançamento
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                <KpiCard title="saldo atual" value={fmt(totalBalance)} change={8.2} icon={DollarSign}/>
                <KpiCard title="Gastos do mês" value={fmt(totalBalance)} change={8.2} icon={CreditCard}/>
                <KpiCard title="Receitas" value={fmt(totalBalance)} change={8.2} icon={TrendingUp}/>
                <KpiCard
                 title="Score da IA"
                 value={`${insight?.score || "-"}/100`}
                 change={-6}
                 icon={BrainCircuit}
                 accent="bg-violet-600/30"
                 />
            </div>
            {/* Fluxo de Caixa */}
            <div className="gri grid-cols-3 gap-4">

                <div className="glass-card p-5 col-span-2">
                    <h2 className="font-semibold text-black mb-1">Fluxo de Caixa</h2>
                    <p className="text-xs text-black/80 mb-4">Comparativo entre entradas e saídas</p>
                    {cashFlowData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-black">
                        Nenhuma transição registrada ainda
                    </div>
                    ) : (
                       <ResponsiveContainer width="100%" height={220}>
                         <LineChart data={cashFlowData}>
                            <XAxis 
                             dataKey="month"
                             stroke="#FFFFFF20"
                             tick={{ fill: "#FFFFFF50", fontSize: 12}}
                            />
                            <YAxis
                             stroke="#FFFFFF20"
                             tick={{ fill: "#FFFFFF50", fontSize: 12}}
                            />
                            <Tooltip 
                             contentStyle={{
                                backgound: "#1A1A2E",
                                border: "1px solid #FFFFFF15",
                                borderRadius: 12,
                                color: "#FFF"
                             }}
                            />
                            <Line 
                             type="monotone"
                             dataKey="Entradas"
                             stroke="#10B981"
                             strokeWidth={2}
                             dot={false}
                            />
                            <Line 
                             type="monotone"
                             dataKey="Saídas"
                             stroke="#7C3AED"
                             strokeWidth={2}
                             dot={false}
                            />
                         </LineChart>
                       </ResponsiveContainer> 
                    )}
                </div>
                {/*Leitura da IA*/}
                <div className="glass-card p-5 flex flex-col gap-3 mt-1">
                    <div>
                        <h2 className="font-semibold text-black">Leitura da IA</h2>
                        <p className="text-xs text-black/80"> Resumo automático do seu comportamento financeiro</p>
                    </div>
                    {insightItems.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-black/50 text-xs text-center">
                            Adicione transações para gerar sua análise de IA
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 flex-1">
                            {insightItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-xl bg-black/5 text-xs text-black/80 leading-relaxed"
                                    >
                                        {item.trim()}
                                </div>
                            ))}
                        </div>
                    )}

                    {insight?.suggested_action && (
                        <div className="p-3 rounded-cl bg-violet-600/15 border border-violet-500/20">
                            <p className="text-xs font-semibold text-violet-400 mb-1 uppercase trackiing-wider">
                                Sugestão prática
                            </p>
                            <p className="text-xs text-black/80">{insight.suggested_action}</p>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    )
}