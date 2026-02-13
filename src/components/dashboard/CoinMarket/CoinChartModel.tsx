/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

    useEffect(() => {
        let isMounted = true; //flag for not update state when component is closed

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
        return [`$${Number(value || 0).toLocaleString()}`, 'Price'];
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <img src={coin.image} alt="" className="w-12 h-12" />
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{coin.name}</h3>
                            <p className="text-slate-500 uppercase font-medium">{coin.symbol} / USD</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setDays(tf.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                days === tf.value
                                    ? 'bg-[#362F5E] text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>

                <div className="h-64 w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
                            Loading data...
                        </div>
                    ) : fetchError ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 rounded-2xl p-4 text-center">
                            <p className="font-bold">Error: {fetchError}</p>
                            <p className="text-xs mt-1">CoinGecko free plan has strict limits. Please wait.</p>
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
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                                    formatter={formatTooltipValue}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={coin.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</p>
                        <p className="text-2xl font-black text-slate-800">${coin.current_price.toLocaleString()}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold ${coin.price_change_percentage_24h >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
            </motion.div>
        </div>
    );
};