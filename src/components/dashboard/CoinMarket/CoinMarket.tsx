/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchCoins } from '../../../store/slices/marketSlice.ts';
import { TrendingUp, TrendingDown, AreaChart as ChartIcon, RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { CoinChartModal } from "./CoinChartModel.tsx";
import {useTranslation} from "react-i18next";

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

const CoinMarket = () => {
    const dispatch = useAppDispatch();
    const { coins, isLoading, error, fiatRates } = useAppSelector((state) => state.market);
    const { theme } = useAppSelector((state) => state.ui);
    const user = useAppSelector((state) => state.auth.user);
    const { t } = useTranslation();

    const isDark = theme === 'dark';
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
        /* ВНЕШНЯЯ ГРАДИЕНТНАЯ РАМКА */
        <div className={`relative p-[1px] rounded-[32px] overflow-hidden transition-all duration-500 shadow-2xl flex-1
            ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-slate-200 to-white'}
        `}>
            {/* ГЛАВНЫЙ КОНТЕЙНЕР (Стекло) */}
            <div className={`relative z-10 rounded-[31px] overflow-hidden h-[500px] flex flex-col transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/90'}
                backdrop-blur-xl
            `}>

                {/* ТАБЛИЦА */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className={`sticky top-0 z-20 backdrop-blur-md transition-colors duration-500
                            ${isDark ? 'bg-white/5 border-b border-white/5' : 'bg-slate-50 border-b border-slate-100'}
                        `}>
                        <tr>
                            <th className="p-5 w-20">
                                <button
                                    onClick={handleRefreshButton}
                                    className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm
                                            ${isDark
                                        ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                                        : 'bg-white border-slate-200 text-slate-500 hover:text-[#362F5E]'}
                                        `}
                                >
                                    <motion.div animate={{ rotate: rotation }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                                        <RefreshCcw size={16} />
                                    </motion.div>
                                </button>
                            </th>
                            <th className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('market.name')}</th>
                            <th className={`text-right text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('market.price')}</th>
                            <th className={`text-right text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('market.change')}</th>
                            <th className="p-4 text-right"></th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-transparent">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Market...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            coins.map((coin) => (
                                <tr key={coin.id} className={`group transition-all duration-300
                                        ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'}
                                    `}>
                                    <td className="p-4 pl-6 text-slate-500 font-mono text-xs italic">
                                        #{coin.market_cap_rank}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={coin.image} alt="" className="w-9 h-9 rounded-full z-10 relative bg-white/10" />
                                                {isDark && <div className="absolute inset-0 blur-md bg-blue-500/20 rounded-full" />}
                                            </div>
                                            <div className="flex flex-col">
                                                    <span className={`font-black text-sm tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        {coin.name}
                                                    </span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{coin.symbol}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`p-4 text-right font-black text-sm tabular-nums transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                            ? `${(coin.current_price * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                            : `${currencySymbols[mainCurrency]}${(coin.current_price * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                                        }
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={`flex items-center justify-end gap-1.5 font-black text-xs ${
                                            coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'
                                        }`}>
                                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            onClick={() => setSelectedCoin(coin)}
                                            className={`p-2 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100
                                                    ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-[#362F5E] hover:bg-slate-100'}
                                                `}
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
            </div>

            <AnimatePresence>
                {selectedCoin && <CoinChartModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CoinMarket;