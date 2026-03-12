import { useMemo, useState } from 'react';
import { useAppSelector } from '../../store';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Zap } from 'lucide-react';

// Заглушка данных для графика (динамика прибыли)
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

    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    // Имитация данных PnL
    const pnlValue = 1240.50 * rate;
    const pnlPercent = +8.45;
    const isProfit = pnlPercent >= 0;

    const chartData = useMemo(() => {
        return MOCK_SERIES[period].map((val, i) => ({ i, val: val * rate }));
    }, [period, rate]);

    return (
        <div className="relative p-[1px] rounded-[48px] overflow-hidden bg-gradient-to-b from-white/10 to-transparent shadow-2xl h-full">
            <div className="relative z-10 bg-[#0D0F14] rounded-[47px] p-8 h-full overflow-hidden flex flex-col">

                {/* ДИНАМИЧЕСКОЕ СВЕЧЕНИЕ (Зависит от профита) */}
                <div className={`absolute top-0 right-0 w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none opacity-20 transition-colors duration-1000 ${isProfit ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                <div className="relative z-20 flex flex-col h-full">
                    {/* ХЕДЕР: ТАЙТЛ + ПЕРЕКЛЮЧАТЕЛЬ */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                <Zap className={isProfit ? "text-emerald-400" : "text-rose-400"} size={20} fill="currentColor" fillOpacity={0.2} />
                                PnL Analysis
                            </h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Performance Metrics</p>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                            {["24h", "7d", "30d"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p as any)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase ${period === p ? 'bg-[#362F5E] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
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
                            <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {isProfit ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isProfit ? '+' : ''}{pnlPercent}%
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-white tabular-nums tracking-tighter">
                            {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${pnlValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                                : `${currencySymbols[mainCurrency]}${pnlValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                            }
                        </h2>
                    </div>

                    {/* ГРАФИК (Sparkline) */}
                    <div className="flex-1 min-h-[100px] w-full -mx-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isProfit ? "#10B981" : "#F43F5E"} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={isProfit ? "#10B981" : "#F43F5E"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
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

                    {/* СЕТКА АНАЛИТИКИ (Маленькие карточки) */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                <Target size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-wider">Win Rate</span>
                            </div>
                            <p className="text-sm font-black text-white">64.2%</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                <Clock size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-wider">Avg Hold</span>
                            </div>
                            <p className="text-sm font-black text-white">12 Days</p>
                        </div>
                    </div>
                </div>

                {/* ТЕКСТУРА ШУМА (Как в прошлом блоке) */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>
        </div>
    );
};