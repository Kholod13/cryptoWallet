import { useMemo, useState } from 'react';
import { useAppSelector } from '../../store';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Zap } from 'lucide-react';

const MOCK_SERIES = {
    "24h": [10, 15, 12, 18, 25, 22, 30],
    "7d": [50, 40, 60, 80, 75, 90, 110],
    "30d": [100, 120, 110, 150, 180, 170, 250]
};

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const PnLAnalytics = () => {
    const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");
    const { user } = useAppSelector(state => state.auth);
    const { fiatRates } = useAppSelector(state => state.market);
    const { theme } = useAppSelector(state => state.ui);

    const isDark = theme === 'dark';
    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    const pnlValue = 1240.50 * rate;
    const pnlPercent = +8.45;
    const isProfit = pnlPercent >= 0;

    const chartData = useMemo(() => {
        return MOCK_SERIES[period].map((val, i) => ({ i, val: val * rate }));
    }, [period, rate]);

    return (
        /* 1. ВНЕШНЯЯ ГРАДИЕНТНАЯ РАМКА */
        <div className={`relative p-[1px] rounded-[48px] overflow-hidden transition-all duration-500 shadow-2xl h-full w-full
            ${isDark
            ? 'bg-gradient-to-b from-white/10 to-transparent shadow-black/20'
            : 'bg-gradient-to-b from-slate-200 to-white shadow-slate-200'}
        `}>
            {/* 2. ГЛАВНЫЙ КОНТЕЙНЕР (Стекло) */}
            <div className={`relative z-10 rounded-[47px] p-8 h-full overflow-hidden flex flex-col transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
                backdrop-blur-xl
            `}>

                {/* ДИНАМИЧЕСКОЕ СВЕЧЕНИЕ (Адаптировано под тему) */}
                <div className={`absolute top-0 right-0 w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none transition-all duration-1000
                    ${isProfit
                    ? (isDark ? 'bg-emerald-500/20' : 'bg-emerald-400/10')
                    : (isDark ? 'bg-rose-500/20' : 'bg-rose-400/10')}
                `} />

                <div className="relative z-20 flex flex-col h-full">
                    {/* ХЕДЕР */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className={`text-xl font-black tracking-tight flex items-center gap-2 transition-colors
                                ${isDark ? 'text-white' : 'text-slate-900'}
                            `}>
                                <Zap className={isProfit ? "text-emerald-400" : "text-rose-400"} size={20} fill="currentColor" fillOpacity={0.2} />
                                PnL Analysis
                            </h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Performance Metrics</p>
                        </div>

                        <div className={`flex p-1 rounded-xl border transition-colors
                            ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}
                        `}>
                            {["24h", "7d", "30d"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p as any)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase cursor-pointer
                                        ${period === p
                                        ? (isDark ? 'bg-[#362F5E] text-white shadow-lg' : 'bg-[#362F5E] text-white shadow-md')
                                        : 'text-slate-500 hover:text-slate-300'}
                                    `}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ЦЕНТРАЛЬНЫЙ ПОКАЗАТЕЛЬ */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Net Profit</span>
                            <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                                ${isProfit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}
                            `}>
                                {isProfit ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isProfit ? '+' : ''}{pnlPercent}%
                            </div>
                        </div>
                        <h2 className={`text-4xl font-black tabular-nums tracking-tighter transition-colors
                            ${isDark ? 'text-white' : 'text-[#362F5E]'}
                        `}>
                            {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${pnlValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                                : `${currencySymbols[mainCurrency]}${pnlValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                            }
                        </h2>
                    </div>

                    {/* ГРАФИК (Sparkline) */}
                    <div className="flex-1 min-h-[120px] w-full -mx-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isProfit ? "#10B981" : "#F43F5E"} stopOpacity={isDark ? 0.3 : 0.2}/>
                                        <stop offset="95%" stopColor={isProfit ? "#10B981" : "#F43F5E"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#161B26' : '#fff',
                                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: '12px'
                                    }}
                                    itemStyle={{ color: isDark ? '#fff' : '#0F172A', fontSize: '12px', fontWeight: 'bold' }}

                                    // ИСПРАВЛЕННЫЙ ФОРМАТТЕР:
                                    // Используем тип any для значения, чтобы не конфликтовать с внутренними типами Recharts
                                    formatter={(val: any) => [
                                        `${Number(val || 0).toLocaleString()} ${mainCurrency}`,
                                        'Profit'
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="val"
                                    stroke={isProfit ? "#10B981" : "#F43F5E"}
                                    strokeWidth={3}
                                    fill="url(#pnlGradient)"
                                    animationDuration={1000}
                                />
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* СЕТКА АНАЛИТИКИ */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        {[
                            { label: "Win Rate", value: "64.2%", icon: Target },
                            { label: "Avg Hold", value: "12 Days", icon: Clock }
                        ].map((stat, i) => (
                            <div key={i} className={`p-3 rounded-2xl border transition-all
                                ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100'}
                            `}>
                                <div className="flex items-center gap-2 mb-1 text-slate-500">
                                    <stat.icon size={12} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">{stat.label}</span>
                                </div>
                                <p className={`text-sm font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ТЕКСТУРА ШУМА (Только для темной темы для глубины) */}
                {isDark && (
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                )}
            </div>
        </div>
    );
};

export default PnLAnalytics;