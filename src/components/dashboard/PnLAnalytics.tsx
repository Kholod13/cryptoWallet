/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../store';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Zap } from 'lucide-react';
import { useTranslation } from "react-i18next";

const MOCK_SERIES = {
    "24h": [10, 15, 12, 18, 25, 22, 30],
    "7d": [50, 40, 60, 80, 75, 90, 110],
    "30d": [100, 120, 110, 150, 180, 170, 250]
};

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const PnLAnalytics = () => {
    const [period] = useState<"24h" | "7d" | "30d">("7d");
    const { user } = useAppSelector(state => state.auth);
    const { fiatRates } = useAppSelector(state => state.market);
    const { theme } = useAppSelector(state => state.ui);
    const { t } = useTranslation();

    const isDark = theme === 'dark';
    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    const pnlPercent = +8.45;
    const isProfit = pnlPercent >= 0;
    const pnlValue = 1240.50 * rate;

    const chartData = useMemo(() => {
        const series = MOCK_SERIES[period] || [];
        return series.map((val, i) => ({
            xKey: i,
            val: val * rate
        }));
    }, [period, rate]);

    return (
        <div className={`relative p-[1px] rounded-[48px] overflow-hidden transition-all duration-500 shadow-2xl h-full w-full
            ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent shadow-black/20' : 'bg-gradient-to-br from-slate-200 to-white'}
        `}>
            <div className={`relative z-10 rounded-[47px] p-8 h-full overflow-hidden flex flex-col transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
                backdrop-blur-xl
            `}>

                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none opacity-20
                    ${isProfit ? (isDark ? 'bg-emerald-500' : 'bg-emerald-400') : (isDark ? 'bg-rose-500' : 'bg-rose-400')}
                `} />

                <div className="relative z-20 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <Zap className={isProfit ? "text-emerald-400" : "text-rose-400"} size={20} fill="currentColor" fillOpacity={0.2} />
                                {t('pnl.title')}
                            </h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{t('pnl.undertitle')}</p>
                        </div>
                    </div>

                    {/* Value Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('pnl.profit')}</span>
                            <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {isProfit ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isProfit ? '+' : ''}{pnlPercent}%
                            </div>
                        </div>
                        <h2 className={`text-4xl font-black tabular-nums tracking-tighter ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                            {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${pnlValue.toLocaleString()} ${currencySymbols[mainCurrency]}`
                                : `${currencySymbols[mainCurrency]}${pnlValue.toLocaleString()}`
                            }
                        </h2>
                    </div>

                    {/* ГРАФИК — ИСПРАВЛЕННЫЙ БЛОК */}
                    <div className="w-full h-[160px] mt-2"> {/* Четкая высота */}
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                                <defs>
                                    {/* Уникальный ID для градиента */}
                                    <linearGradient id="pnlVisualGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isProfit ? "#10B981" : "#F43F5E"} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={isProfit ? "#10B981" : "#F43F5E"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>

                                <XAxis dataKey="xKey" hide />
                                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#161B26' : '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                    }}
                                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                                    labelStyle={{ display: 'none' }}
                                    formatter={(val: any) => [`${val.toLocaleString()} ${mainCurrency}`, t('pnl.value_profit')]}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="val"
                                    stroke={isProfit ? "#10B981" : "#F43F5E"}
                                    strokeWidth={4}
                                    fill="url(#pnlVisualGradient)" // Используем уникальный ID
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bottom Stats */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                <Target size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-wider">{t('pnl.rate')}</span>
                            </div>
                            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>64.2%</p>
                        </div>
                        <div className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                <Clock size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-wider">{t('pnl.hold')}</span>
                            </div>
                            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>12 {t('pnl.days')}</p>
                        </div>
                    </div>
                </div>

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
            </div>
        </div>
    );
};

export default PnLAnalytics;