import { useMemo } from 'react';
import { useAppSelector } from '../../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const AggregatedAssets = () => {
    const { connectedWallets } = useAppSelector(state => state.wallet);
    const { coins, fiatRates } = useAppSelector(state => state.market);
    const { user } = useAppSelector(state => state.auth);

    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    const data = useMemo(() => {
        // 1. Создаем карту для суммирования количества монет
        const map: Record<string, { amount: number, symbol: string, lastPrice: number }> = {};

        connectedWallets.forEach(wallet => {
            (wallet.assets || []).forEach(asset => {
                const sym = asset.symbol.toLowerCase();

                if (!map[sym]) {
                    map[sym] = { amount: 0, symbol: sym, lastPrice: 0 };
                }

                // Плюсуем количество монет из этого кошелька к общему числу
                map[sym].amount += asset.amount;

                // Запоминаем цену из кошелька (если она там есть)
                if (asset.price) map[sym].lastPrice = asset.price;
            });
        });

        // 2. Превращаем карту в массив и считаем стоимость каждой кучки монет
        return Object.values(map).map(item => {
            // Ищем актуальную цену в глобальном Маркете
            const marketCoin = coins.find(c => c.symbol.toLowerCase() === item.symbol);

            // ПРИОРИТЕТ ЦЕНЫ: 1. Маркет (CoinCap) | 2. Цена из кошелька | 3. Ноль
            const currentPrice = marketCoin?.current_price || item.lastPrice || 0;

            // Считаем итоговую стоимость этой монеты во всех кошельках
            const valueInCurrency = item.amount * currentPrice * rate;

            return {
                name: marketCoin?.name || item.symbol.toUpperCase(),
                symbol: item.symbol.toUpperCase(),
                amount: item.amount,
                value: valueInCurrency,
                image: marketCoin?.image || `https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`
            };
        })
            .filter(asset => asset.value > 0.1) // Убираем совсем копеечные остатки
            .sort((a, b) => b.value - a.value);
    }, [connectedWallets, coins, rate]);

// Важно: totalValue считаем на основе уже агрегированных и отфильтрованных данных
    const totalValue = useMemo(() => data.reduce((a, b) => a + b.value, 0), [data]);

    if (connectedWallets.length === 0) return null;


    // Функция для отрисовки кастомных выносок (линия + текст)
    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, outerRadius, value, name, fill, percent } = props;
        const RADIAN = Math.PI / 180;

        // Расчет координат для линий
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
                {/* Линия-выноска */}
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} opacity={0.6} />
                {/* Маленькая точка на конце линии */}
                <circle cx={ex} cy={ey} r={2} fill={fill} />

                {/* Текст: Название и Процент */}
                <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={-4} textAnchor={textAnchor} fill="#fff" fontSize={12} fontWeight="900" style={{ letterSpacing: '0.02em' }}>
                    {name} ({(percent * 100).toFixed(1)}%)
                </text>

                {/* Текст: Цена в валюте */}
                <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={14} textAnchor={textAnchor} fill="rgba(255,255,255,0.5)" fontSize={10} fontWeight="bold">
                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                        ? `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                        : `${currencySymbols[mainCurrency]}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    }
                </text>
            </g>
        );
    };

    // @ts-ignore
    return (
        <div className="relative p-[1px] rounded-[48px] overflow-hidden bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
            {/* ГЛУБОКИЙ ФОН С ЖИВЫМ СВЕТОМ */}
            <div className="relative z-10 bg-[#0D0F14] rounded-[47px] p-8 md:p-10 overflow-hidden">

                {/* ЭФФЕКТ "СВЕТОВОГО ЯДРА" */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-20">
                    {/* ХЕДЕР БЛОКА */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Activity className="text-emerald-400" size={20} />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Portfolio Insight</h3>
                            </div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] ml-1">Live Asset Distribution</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Net Worth</p>
                            <p className="text-2xl font-black text-white tabular-nums">
                                {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-blue-500">{mainCurrency}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 items-center">

                        {/* ЛЕВАЯ ЧАСТЬ: ДИАГРАММА (Premium Look) */}
                        <div className="w-full lg:w-1/2 h-[400px] relative flex items-center justify-center outline-none ring-0 focus:outline-none focus:ring-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart > {/* Добавили overflow: visible, чтобы метки не скрывались */}
                                    <Pie
                                        data={data}
                                        cx="50%" cy="50%"
                                        innerRadius={75} // Чуть уменьшили, чтобы хватило места для текста
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={10}
                                        // ПОДКЛЮЧАЕМ НАШУ ФУНКЦИЮ:
                                        label={renderCustomizedLabel}
                                        labelLine={false} // Отключаем стандартные линии, т.к. рисуем свои
                                    >
                                        {data.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                style={{
                                                    filter: `drop-shadow(0 0 12px ${COLORS[index % COLORS.length]}33)`,
                                                    outline: 'none'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#161B26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Твой центр диаграммы остается без изменений */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Diversification</span>
                                <span className="text-4xl font-black text-white">{data.length}</span>
                                <span className="text-[10px] text-emerald-400 font-bold mt-1">Assets</span>
                            </div>
                        </div>

                        {/* ПРАВАЯ ЧАСТЬ: СЕТКА (Glass Tiles) */}
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-4 custom-scrollbar content-start">
                                <AnimatePresence>
                                    {data.map((asset, index) => (
                                        <motion.div
                                            key={asset.symbol}
                                            whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.06)" }}
                                            className="relative p-4 rounded-[24px] bg-white/[0.03] border border-white/5 transition-all group overflow-hidden"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="relative">
                                                    <img src={asset.image} className="w-8 h-8 rounded-full z-10 relative" alt="" />
                                                    <div className="absolute inset-0 blur-md opacity-50 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-white text-sm truncate">{asset.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset.amount.toFixed(2)} {asset.symbol}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <p className="font-bold text-white text-lg tabular-nums">
                                                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                                        ? `${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currencySymbols[mainCurrency]}`
                                                        : `${currencySymbols[mainCurrency]}${asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                                    }
                                                </p>
                                                <div className="text-[10px] font-black px-2 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/5">
                                                    {((asset.value / totalValue) * 100).toFixed(1)}%
                                                </div>
                                            </div>

                                            {/* Accent Line */}
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