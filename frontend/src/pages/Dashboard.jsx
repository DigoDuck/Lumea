import { useEffect, useState } from "react";
import { DollarSign,CreditCard,TrendingUp,MoonStar,Plus } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart,Bar, PieChart, Pie, Cell,Legend
} from "recharts";
import KpiCard from "@/components/shared/KpiCard";
import { transactionsApi } from "@/api/transactions";
import { walletApi } from "@/api/wallets";
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
                    walletApi.list(),
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
                    <p className="text-black/60 text-sm">Bem-vindo de volta</p>
                </div>
            </div>
        </div>
    )
}