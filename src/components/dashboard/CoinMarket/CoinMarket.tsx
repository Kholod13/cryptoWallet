/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchCoins } from '../../../store/slices/marketSlice.ts';
import { TrendingUp, TrendingDown, AreaChart as ChartIcon, RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { CoinChartModal } from "./CoinChartModel.tsx";

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

const CoinMarket = () => {
    const dispatch = useAppDispatch();
    const { coins, isLoading, error, fiatRates } = useAppSelector((state) => state.market);
    const user = useAppSelector((state) => state.auth.user);

    // ИСПРАВЛЕНО: безопасное получение валюты
    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
    const [rotation, setRotation] = useState(0);

    const handleRefreshButton = () => {
        setRotation(prev => prev + 360);
        dispatch(fetchCoins());
    };

    useEffect(() => {
        dispatch(fetchCoins());
    }, [dispatch, mainCurrency]);

    if (error) return <div className="text-red-500 p-10 font-bold text-center">Error: {error}</div>;

    return (
        <div className="flex flex-col flex-1 gap-6 max-w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-197 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-4">
                            <button onClick={handleRefreshButton} className="p-2 cursor-pointer bg-white rounded-lg border border-slate-200">
                                <motion.div animate={{ rotate: rotation }} transition={{ duration: 0.6 }}>
                                    <RefreshCcw size={15} />
                                </motion.div>
                            </button>
                        </th>
                        <th className="p-4">Name</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right">24h Change</th>
                        <th className="p-4 text-right">Chart</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr><td colSpan={5} className="p-10 text-center animate-pulse">Loading...</td></tr>
                    ) : (
                        coins.map((coin) => (
                            <tr key={coin.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                <td className="p-4 text-slate-400 text-sm">{coin.market_cap_rank}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={coin.image} alt="" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-bold text-slate-800">{coin.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{coin.symbol}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-semibold text-slate-700 text-right">
                                    {/* КОНВЕРТАЦИЯ ЦЕНЫ */}
                                    {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                        ? `${(coin.current_price * rate).toLocaleString()} ${currencySymbols[mainCurrency]}`
                                        : `${currencySymbols[mainCurrency]}${(coin.current_price * rate).toLocaleString()}`
                                    }
                                </td>
                                <td className="p-4 text-right">
                                    <div className={`flex items-center justify-end gap-1 font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setSelectedCoin(coin)} className="p-2 text-slate-400 hover:text-[#362F5E] cursor-pointer">
                                        <ChartIcon size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            <AnimatePresence>
                {selectedCoin && <CoinChartModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CoinMarket;