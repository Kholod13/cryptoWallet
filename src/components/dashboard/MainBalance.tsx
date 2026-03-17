import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchSourceBalances, syncExchangeBalances } from "../../store/slices/walletSlice.ts";

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const MainBalance = () => {
    const dispatch = useAppDispatch();

    // Достаем тему, курсы и данные пользователя
    const { coins, fiatRates } = useAppSelector((state) => state.market);
    const { theme } = useAppSelector((state) => state.ui);
    const { user } = useAppSelector((state) => state.auth);
    const { connectedWallets } = useAppSelector(state => state.wallet);

    const isDark = theme === 'dark';
    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;
    const [isVisible, setIsVisible] = React.useState(true);

    const totalBalance = useMemo(() => {
        const totalUSD = connectedWallets.reduce((total, wallet) => {
            const assets = wallet.assets || [];
            const walletSum = assets.reduce((sum: number, asset: any) => {
                if (asset.usdValue && asset.usdValue > 0) {
                    return sum + asset.usdValue;
                }
                const marketCoin = coins.find(c =>
                    c.symbol.toLowerCase() === asset.symbol.toLowerCase()
                );
                const price = marketCoin?.current_price || asset.price || 0;
                return sum + (asset.amount * price);
            }, 0);
            return total + walletSum;
        }, 0);

        return totalUSD * rate;
    }, [connectedWallets, coins, rate]);

    useEffect(() => {
        if (connectedWallets.length > 0) {
            connectedWallets.forEach(wallet => {
                if (wallet.type === 'exchange') {
                    dispatch(syncExchangeBalances({
                        id: wallet.id,
                        platform: wallet.platform,
                        apiKey: wallet.apiKey!,
                        apiSecret: wallet.apiSecret!,
                        passphrase: wallet.passphrase
                    }));
                } else if (wallet.type === 'web3') {
                    dispatch(fetchSourceBalances(wallet));
                }
            });
        }
    }, [connectedWallets.length, dispatch]);

    return (
        /* 1. ВНЕШНЯЯ ГРАДИЕНТНАЯ РАМКА (p-[1px]) */
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-[1px] rounded-[40px] transition-all duration-500 h-fit shadow-2xl overflow-hidden min-w-[480px] `}
        >
            {/* 2. ГЛАВНЫЙ КОНТЕЙНЕР (Стекло) */}
            <div className={`relative z-10 p-8 rounded-[39px] backdrop-blur-[20px] h-auto flex flex-col justify-between transition-colors duration-500
                ${isDark ? 'bg-[#362F5E]/90' : 'bg-white/80'}
            `}>

                {/* ДЕКОРАТИВНЫЕ СВЕТОВЫЕ ПЯТНА */}
                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20
                    ${isDark ? 'bg-white' : 'bg-blue-400'}
                `} />

                <div className="relative z-20">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#362F5E]'}`}>
                                <Wallet size={18} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                Total Balance
                            </span>
                        </div>
                        <button
                            onClick={() => setIsVisible(!isVisible)}
                            className={`p-2 rounded-full transition-all cursor-pointer 
                                ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-black/5 text-slate-400'}
                            `}
                        >
                            {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    <div className="flex items-baseline gap-4 mt-2">
                        <div className="relative">
                            {/* Ghost (Призрак для ширины) */}
                            <h2 className="text-5xl font-black tracking-tighter invisible whitespace-nowrap tabular-nums">
                                {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                    ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                    : `${currencySymbols[mainCurrency]}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            </h2>

                            {/* Реальный текст */}
                            <h2 className={`text-5xl font-black tracking-tighter absolute top-0 left-0 whitespace-nowrap tabular-nums transition-colors
                                ${isDark ? 'text-white' : 'text-[#362F5E]'}
                            `}>
                                {isVisible
                                    ? (mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                        ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                        : `${currencySymbols[mainCurrency]}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                                    : '••••••'}
                            </h2>
                        </div>

                        <span className={`text-xl font-bold transition-colors ${isDark ? 'text-emerald-400' : 'text-emerald-600'} opacity-60`}>
                            {mainCurrency}
                        </span>
                    </div>
                </div>

                {/* НИЖНИЙ БЕДЖ */}
                <div className="relative z-20 flex items-center gap-2 w-fit px-4 py-2 rounded-2xl transition-colors mt-5
                    ${isDark ? 'bg-white/10 border border-white/5' : 'bg-slate-100/80 border border-slate-200'}
                ">
                    <div className={`rounded-full p-1 ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`}>
                        <TrendingUp size={10} className={isDark ? 'text-slate-900' : 'text-white'} />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-600'}`}>
                        Live Data <span className="opacity-50 ml-1 font-bold italic">synchronized</span>
                    </p>
                </div>
            </div>

            {/* ТЕКСТУРА ШУМА */}
            {isDark && (
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
            )}
        </motion.div>
    );
};

export default MainBalance;