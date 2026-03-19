/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";
import { useAppSelector } from '../../../store/'; // Импортируем селектор

interface ICoin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
}

interface Props {
    coin: ICoin;
    onClose: () => void;
}

interface IChartData {
    time: string;
    price: number;
}

const TIMEFRAMES = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '1M', value: '30' },
    { label: '3M', value: '90' },
    { label: '1Y', value: '365' },
];

export const CoinChartModal = ({ coin, onClose }: Props) => {
    const [history, setHistory] = useState<IChartData[]>([]);
    const [days, setDays] = useState('7');
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
    const { t } = useTranslation();

    // 1. Достаем текущую тему из Redux
    const { theme } = useAppSelector((state) => state.ui);
    const isDark = theme === 'dark';

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setIsLoading(true);
            setFetchError(null);

            try {
                const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${days}`, {
                    headers: {
                        'accept': 'application/json',
                        'x-cg-demo-api-key': apiKey
                    }
                })

                if (res.status === 429) {
                    throw new Error('API limit reached. Wait 1 min.');
                }

                if (!res.ok) throw new Error('Network error');

                const data = await res.json();

                if (isMounted) {
                    const formattedData: IChartData[] = data.prices.map((p: [number, number]) => ({
                        time: new Date(p[0]).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            ...(days === '1' ? { hour: '2-digit' } : {})
                        }),
                        price: p[1]
                    }));
                    setHistory(formattedData);
                }
            } catch (err: any) {
                if (isMounted) setFetchError(err.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();

        return () => { isMounted = false; };
    }, [coin.id, days]);

    const formatTooltipValue = (value: any) => {
        return [`$${Number(value || 0).toLocaleString()}`, t('market.price')];
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={`relative w-full max-w-2xl rounded-[40px] shadow-2xl p-8 overflow-hidden border transition-colors duration-500
                    ${isDark ? 'bg-[#161B26] border-white/10' : 'bg-white border-slate-200'}
                `}
            >
                {/* Декоративное свечение для темной темы */}
                {isDark && <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />}

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <img src={coin.image} alt="" className="w-12 h-12 rounded-full bg-white/10 p-1" />
                        <div>
                            <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {coin.name}
                            </h3>
                            <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">{coin.symbol} / USD</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors cursor-pointer 
                            ${isDark ? 'hover:bg-white/5 text-slate-500' : 'hover:bg-black/5 text-slate-400'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Переключатель периодов */}
                <div className={`flex gap-2 mb-8 p-1.5 rounded-2xl w-fit border transition-colors
                    ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'}
                `}>
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setDays(tf.value)}
                            className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer
                                ${days === tf.value
                                ? 'bg-[#362F5E] text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>

                {/* Контейнер графика */}
                <div className="h-64 w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-slate-400 animate-pulse font-bold tracking-widest uppercase text-xs">
                            LOADING...
                        </div>
                    ) : fetchError ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-500/5 rounded-3xl p-4 text-center">
                            <p className="font-bold">Error: {fetchError}</p>
                            <p className="text-[10px] mt-1 opacity-60 uppercase">CoinGecko free plan limits reached</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={coin.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={coin.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#161B26' : '#fff',
                                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: isDark ? '#fff' : '#0F172A', fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={formatTooltipValue}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={coin.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    animationDuration={1000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Футер модалки */}
                <div className={`mt-8 flex justify-between items-center border-t pt-6 transition-colors duration-500
                    ${isDark ? 'border-white/5' : 'border-slate-100'}
                `}>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t('market.price')}</p>
                        <p className={`text-3xl font-black tabular-nums transition-colors ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                            ${coin.current_price.toLocaleString()}
                        </p>
                    </div>
                    <div className={`px-5 py-2.5 rounded-2xl font-black text-sm shadow-sm
                        ${coin.price_change_percentage_24h >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
                    `}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
            </motion.div>
        </div>
    );
};