/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useAppSelector } from '../../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import {useTranslation} from "react-i18next";

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const AggregatedAssets = () => {
    const { connectedWallets } = useAppSelector(state => state.wallet);
    const { coins, fiatRates } = useAppSelector(state => state.market);
    const { user } = useAppSelector(state => state.auth);
    const { theme } = useAppSelector(state => state.ui);
    const { t } = useTranslation();

    const isDark = theme === 'dark';
    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    const data = useMemo(() => {
        const map: Record<string, { amount: number, symbol: string, totalValueUSD: number }> = {};

        connectedWallets.forEach(wallet => {
            (wallet.assets || []).forEach(asset => {
                const sym = asset.symbol.toLowerCase();
                let currentAssetUSD = 0;

                if (asset.usdValue && asset.usdValue > 0) {
                    currentAssetUSD = asset.usdValue;
                } else {
                    const marketCoin = coins.find(c => c.symbol.toLowerCase() === sym);
                    const price = marketCoin?.current_price || asset.price || 0;
                    currentAssetUSD = asset.amount * price;
                }

                if (!map[sym]) {
                    map[sym] = { amount: 0, symbol: sym, totalValueUSD: 0 };
                }

                map[sym].amount += asset.amount;
                map[sym].totalValueUSD += currentAssetUSD;
            });
        });

        return Object.values(map).map(item => {
            const marketCoin = coins.find(c => c.symbol.toLowerCase() === item.symbol);
            return {
                name: marketCoin?.name || item.symbol.toUpperCase(),
                symbol: item.symbol.toUpperCase(),
                amount: item.amount,
                value: item.totalValueUSD * rate,
                image: marketCoin?.image || `https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`
            };
        })
            .filter(asset => asset.value > 0.01)
            .sort((a, b) => b.value - a.value);
    }, [connectedWallets, coins, rate]);

    const totalValue = useMemo(() => data.reduce((a, b) => a + b.value, 0), [data]);

    if (connectedWallets.length === 0) return null;

    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, outerRadius, value, name, fill, percent } = props;
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 5) * cos;
        const sy = cy + (outerRadius + 5) * sin;
        const mx = cx + (outerRadius + 20) * cos;
        const my = cy + (outerRadius + 20) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} opacity={0.6} />
                <circle cx={ex} cy={ey} r={2} fill={fill} />
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 8}
                    y={ey}
                    dy={-4}
                    textAnchor={textAnchor}
                    fill={isDark ? "#fff" : "#1E293B"}
                    fontSize={12}
                    fontWeight="900"
                    style={{ letterSpacing: '0.02em' }}
                >
                    {name} ({(percent * 100).toFixed(1)}%)
                </text>
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 8}
                    y={ey}
                    dy={14}
                    textAnchor={textAnchor}
                    fill={isDark ? "rgba(255,255,255,0.5)" : "rgba(30,41,59,0.6)"}
                    fontSize={10}
                    fontWeight="bold"
                >
                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                        ? `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                        : `${currencySymbols[mainCurrency]}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    }
                </text>
            </g>
        );
    };

    return (
        <div className={`relative p-[1px] rounded-[48px] overflow-hidden transition-all duration-500 shadow-2xl
            ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-slate-200 to-white'}
        `}>
            {/* ГЛАВНЫЙ КОНТЕЙНЕР */}
            <div className={`relative z-10 rounded-[47px] p-8 md:p-10 overflow-hidden transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
            `}>
                {/* ЖИВОЙ СВЕТ */}
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000
                    ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/10'}
                `} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000
                    ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/5'}
                `} />

                <div className="relative z-20">
                    {/* ХЕДЕР */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                    <Activity className={isDark ? "text-emerald-400" : "text-emerald-600"} size={20} />
                                </div>
                                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {t('portfolio.title')}
                                </h3>
                            </div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] ml-1">
                                {t('portfolio.undertitle')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('portfolio.total')}</p>
                            <p className={`text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                                {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className={isDark ? "text-blue-500" : "text-blue-600"}>{mainCurrency}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 items-center">
                        {/* ДИАГРАММА */}
                        <div className="w-full lg:w-1/2 h-[400px] min-h-[400px] relative flex items-center justify-center outline-none ring-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%" cy="50%"
                                        innerRadius={75}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={10}
                                        label={renderCustomizedLabel}
                                        labelLine={false}
                                    >
                                        {data.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                style={{
                                                    filter: isDark ? `drop-shadow(0 0 12px ${COLORS[index % COLORS.length]}33)` : 'none',
                                                    outline: 'none'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#161B26' : '#fff',
                                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                        }}
                                        itemStyle={{ color: isDark ? '#fff' : '#1E293B', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Diversification</span>
                                <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.length}</span>
                                <span className={`text-[10px] font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Assets</span>
                            </div>
                        </div>

                        {/* СЕТКА АКТИВОВ */}
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-4 custom-scrollbar content-start">
                                <AnimatePresence>
                                    {data.map((asset, index) => (
                                        <motion.div
                                            key={asset.symbol}
                                            whileHover={{ y: -4, backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.02)" }}
                                            className={`relative p-4 rounded-[24px] border transition-all group overflow-hidden
                                                ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="relative">
                                                    <img src={asset.image} className="w-8 h-8 rounded-full z-10 relative bg-white/10" alt="" />
                                                    {isDark && <div className="absolute inset-0 blur-md opacity-50 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-black text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset.amount.toFixed(2)} {asset.symbol}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <p className={`font-bold text-lg tabular-nums ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                                                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                                        ? `${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                                                        : `${currencySymbols[mainCurrency]}${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                                    }
                                                </p>
                                                <div className={`text-[10px] font-black px-2 py-1 rounded-lg border
                                                    ${isDark ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-white text-slate-500 border-slate-100'}
                                                `}>
                                                    {((asset.value / totalValue) * 100).toFixed(1)}%
                                                </div>
                                            </div>

                                            <div className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full opacity-30" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AggregatedAssets;