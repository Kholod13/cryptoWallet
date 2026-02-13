/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchCoins } from '../../../store/slices/marketSlice.ts';
import {TrendingUp, TrendingDown, AreaChart as ChartIcon, RefreshCcw} from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { CoinChartModal } from "./CoinChartModel.tsx";

const CoinMarket = () => {
    const dispatch = useAppDispatch();
    const { coins, isLoading, error } = useAppSelector((state) => state.market);
    const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
    const [rotation, setRotation] = useState(0);
    const { mainCurrency } = useAppSelector(state => state.user);

    const handleRefreshButton = () => {
        setRotation(prev => prev + 360);

        dispatch(fetchCoins(mainCurrency));
    }

    useEffect(() => {
        dispatch(fetchCoins(mainCurrency));
    }, [dispatch]);

    if (error) return <div className="text-red-500 p-10 font-bold text-center">Error: {error}</div>;

    return (
        <div className="flex flex-col flex-1 gap-6 max-w-1/3">
            {/* Coins table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-4 text-slate-500 font-medium text-sm">
                            <button
                                onClick={handleRefreshButton}
                                className="text-sm bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
                            >
                                <motion.div
                                    animate={{ rotate: rotation }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="flex items-center justify-center"
                                >
                                    <RefreshCcw size={15} />
                                </motion.div>
                            </button>
                        </th>
                        <th className="p-4 text-slate-500 font-medium text-sm">Name</th>
                        <th className="p-4 text-slate-500 font-medium text-sm text-right">Price</th>
                        <th className="p-4 text-slate-500 font-medium text-sm text-right">24h Change</th>
                        <th className="p-4 text-slate-500 font-medium text-sm text-right">Chart</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse border-b border-slate-50">
                                <td colSpan={5} className="p-6 bg-slate-50/50"></td>
                            </tr>
                        ))
                    ) : (
                        coins.map((coin) => (
                            <tr key={coin.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                <td className="p-4 text-slate-400 text-sm">{coin.market_cap_rank}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-bold text-slate-800 leading-none">{coin.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase mt-1">{coin.symbol}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-semibold text-slate-700 text-right">
                                    ${coin.current_price.toLocaleString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className={`flex items-center justify-end gap-1 font-medium ${
                                        coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-red-500'
                                    }`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setSelectedCoin(coin)}
                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                        <ChartIcon size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal matrix (not inside table!) */}
            <AnimatePresence>
                {selectedCoin && (
                    <CoinChartModal
                        coin={selectedCoin}
                        onClose={() => setSelectedCoin(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CoinMarket;