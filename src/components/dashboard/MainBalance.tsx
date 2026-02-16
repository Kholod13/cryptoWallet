import React, { useMemo } from 'react';
import { useAppSelector } from '../../store';
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainBalance = () => {
    const [isVisible, setIsVisible] = React.useState(true);

    const { myAssets } = useAppSelector((state) => state.wallet);
    const { coins, fiatRates } = useAppSelector((state) => state.market);
    const { mainCurrency } = useAppSelector((state) => state.user);

    const totalBalance = useMemo(() => {
        // 1. Считаем всё сначала в USD
        const totalUSD = myAssets.reduce((acc, asset) => {
            // ВАЖНО: В CoinLore id может быть числом "90",
            // проверь, чтобы asset.id совпадал с тем, что присылает API
            const coinInfo = coins.find(c => c.symbol.toLowerCase() === asset.symbol.toLowerCase());
            const priceUSD = coinInfo?.current_price || 0;
            return acc + (asset.amount * priceUSD);
        }, 0);

        // 2. Умножаем на курс выбранной валюты
        const rate = fiatRates[mainCurrency] || 1;
        return totalUSD * rate;
    }, [myAssets, coins, fiatRates, mainCurrency]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#362F5E] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden flex-1 h-[220px] w-full max-w-[450px]"
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

                        {/* Ghost */}
                        <h2 className="text-5xl font-black tracking-tight invisible whitespace-nowrap">
                            {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                : `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </h2>

                        {/* Visible text */}
                        <h2 className="text-5xl font-black tracking-tight absolute top-0 left-0 whitespace-nowrap">
                            {isVisible
                                ? (mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                    ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                                : '••••••'}
                        </h2>
                    </div>

                    {/* mainCurrency */}
                    <span className="text-2xl font-bold text-emerald-400 opacity-60">
                        {mainCurrency}
                    </span>
                </div>

                <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
                    <div className="bg-emerald-500 rounded-full p-1">
                        <TrendingUp size={12} className="text-slate-900" />
                    </div>
                    <p className="text-sm font-bold">
                        +5.2% <span className="opacity-60 font-normal ml-1">than last month</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MainBalance;