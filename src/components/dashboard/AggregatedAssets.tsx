/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useTranslation } from "react-i18next";

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

    // --- ДЕТЕКТОР ШИРИНЫ ЭКРАНА ДЛЯ ГРАФИКА ---
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isSmallMobile = windowWidth < 480;

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
                if (!map[sym]) map[sym] = { amount: 0, symbol: sym, totalValueUSD: 0 };
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
        // На маленьких экранах отключаем внешние текстовые метки, чтобы не ломать верстку
        if (isSmallMobile) return null;

        const { cx, cy, midAngle, outerRadius, value, name, fill, percent } = props;
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 5) * cos;
        const sy = cy + (outerRadius + 5) * sin;
        const mx = cx + (outerRadius + (isMobile ? 10 : 20)) * cos;
        const my = cy + (outerRadius + (isMobile ? 10 : 20)) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * (isMobile ? 12 : 22);
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} opacity={0.6} />
                <circle cx={ex} cy={ey} r={2} fill={fill} />
                <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={-4} textAnchor={textAnchor} fill={isDark ? "#fff" : "#1E293B"} fontSize={isMobile ? 10 : 12} fontWeight="900">
                    {name} ({(percent * 100).toFixed(1)}%)
                </text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={14} textAnchor={textAnchor} fill={isDark ? "rgba(255,255,255,0.5)" : "rgba(30,41,59,0.6)"} fontSize={isMobile ? 9 : 10} fontWeight="bold">
                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                        ? `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                        : `${currencySymbols[mainCurrency]}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    }
                </text>
            </g>
        );
    };

    return (
        <div className={`relative p-[1px] rounded-[32px] md:rounded-[48px] overflow-hidden transition-all duration-500 shadow-2xl
            ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-slate-200 to-white'}
        `}>
            <div className={`relative z-10 rounded-[31px] md:rounded-[47px] p-5 md:p-10 overflow-hidden transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
            `}>
                {/* ЭФФЕКТЫ СВЕТА */}
                <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none opacity-20
                    ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'}
                `} />

                <div className="relative z-20">
                    {/* ХЕДЕР */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                    <Activity className={isDark ? "text-emerald-400" : "text-emerald-600"} size={20} />
                                </div>
                                <h3 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {t('portfolio.title')}
                                </h3>
                            </div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] ml-1">
                                {t('portfolio.undertitle')}
                            </p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto p-4 sm:p-0 bg-white/5 sm:bg-transparent rounded-2xl border border-white/5 sm:border-none">
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-0.5">{t('portfolio.total')}</p>
                            <p className={`text-xl md:text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                                {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className={isDark ? "text-blue-500" : "text-blue-600"}>{mainCurrency}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center">
                        {/* ДИАГРАММА */}
                        <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] relative flex items-center justify-center outline-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%" cy="50%"
                                        // Адаптивные радиусы
                                        innerRadius={isMobile ? 60 : 75}
                                        outerRadius={isMobile ? 85 : 100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={isMobile ? 6 : 10}
                                        label={renderCustomizedLabel}
                                        labelLine={false}
                                    >
                                        {data.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                style={{ outline: 'none' }}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#161B26' : '#fff',
                                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                                            borderRadius: '16px',
                                        }}
                                        itemStyle={{ color: isDark ? '#fff' : '#1E293B', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className={`text-2xl md:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.length}</span>
                                <span className={`text-[9px] md:text-[10px] font-bold mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Assets</span>
                            </div>
                        </div>

                        {/* СЕТКА АКТИВОВ (Адаптивная) */}
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[340px] md:max-h-[380px] overflow-y-auto pr-2 custom-scrollbar content-start">
                                <AnimatePresence>
                                    {data.map((asset, index) => (
                                        <motion.div
                                            key={asset.symbol}
                                            whileHover={{ y: -4 }}
                                            className={`relative p-3 md:p-4 rounded-[20px] md:rounded-[24px] border transition-all
                                                ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3 mb-2 md:mb-3">
                                                <img src={asset.image} className="w-7 h-7 md:w-8 md:h-8 rounded-full z-10 relative bg-white/10" alt="" />
                                                <div className="min-w-0">
                                                    <p className={`font-black text-xs md:text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.name}</p>
                                                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset.amount.toFixed(2)} {asset.symbol}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <p className={`font-bold text-md md:text-lg tabular-nums ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                                                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                                        ? `${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                                                        : `${currencySymbols[mainCurrency]}${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                                    }
                                                </p>
                                                <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border
                                                    ${isDark ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-white text-slate-500 border-slate-100'}
                                                `}>
                                                    {((asset.value / totalValue) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-30" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
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