import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
// Импортируем экшены
import { fetchSourceBalances, syncExchangeBalances } from "../../store/slices/walletSlice.ts";

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const MainBalance = () => {
    const dispatch = useAppDispatch();

    // 1. Достаем данные из стора
    const { coins, fiatRates } = useAppSelector((state) => state.market);
    const { user } = useAppSelector((state) => state.auth);
    const { connectedWallets } = useAppSelector(state => state.wallet);

    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;
    const [isVisible, setIsVisible] = React.useState(true);

    // 2. РАСЧЕТ ОБЩЕГО БАЛАНСА (с защитой от пустых assets)
    // Внутри useMemo в MainBalance.tsx
    // Внутри useMemo в MainBalance.tsx
    const totalBalance = useMemo(() => {
        const totalUSD = connectedWallets.reduce((total, wallet) => {
            const assets = wallet.assets || [];
            const walletSum = assets.reduce((sum: number, asset: any) => {

                // 1. ПРИОРИТЕТ: берем уже готовую стоимость в USD от Moralis
                if (asset.usdValue && asset.usdValue > 0) {
                    return sum + asset.usdValue;
                }

                // 2. Если стоимости нет, пытаемся рассчитать через Маркет (CoinCap)
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

    // 3. АВТО-ОБНОВЛЕНИЕ ВСЕХ КОШЕЛЬКОВ ПРИ ЗАГРУЗКЕ
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
    }, [connectedWallets.length]); // Сработает, когда список кошельков загрузится из базы

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#362F5E] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden h-[220px] w-fit min-w-[300px]"
        >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 opacity-80">
                        <Wallet size={18} />
                        <span className="text-sm font-medium uppercase tracking-wider">Total Balance</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                        {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <div className="flex items-baseline gap-3 mt-2">
                    <div className="relative">
                        <h2 className="text-5xl font-black tracking-tight invisible whitespace-nowrap">
                            {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                : `${currencySymbols[mainCurrency]}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </h2>

                        <h2 className="text-5xl font-black tracking-tight absolute top-0 left-0 whitespace-nowrap">
                            {isVisible
                                ? (mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                    ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                    : `${currencySymbols[mainCurrency]}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                                : '••••••'}
                        </h2>
                    </div>

                    <span className="text-2xl font-bold text-emerald-400 opacity-60 pr-15">
                        {mainCurrency}
                    </span>
                </div>

                <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
                    <div className="bg-emerald-500 rounded-full p-1">
                        <TrendingUp size={12} className="text-slate-900" />
                    </div>
                    <p className="text-sm font-bold">
                        Live Data <span className="opacity-60 font-normal ml-1">synchronized</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MainBalance;