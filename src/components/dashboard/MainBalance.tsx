import React, {useMemo} from 'react';
import { useAppSelector } from '../../store';
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

// Словарь символов для красивого отображения
const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    CZK: 'Kč',
    UAH: '₴'
};

export const MainBalance = () => {
    const { coins, fiatRates } = useAppSelector((state) => state.market);
    const { user } = useAppSelector((state) => state.auth);
    const { connectedWallets } = useAppSelector(state => state.wallet);

    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;
    const [isVisible, setIsVisible] = React.useState(true);

    const totalBalance = useMemo(() => {
        const totalUSD = connectedWallets.reduce((total, wallet) => {
            const walletSum = wallet.assets.reduce((sum, asset) => {
                const coinPrice = coins.find(c => c.symbol.toLowerCase() === asset.symbol.toLowerCase())?.current_price || 0;
                return sum + (asset.amount * coinPrice);
            }, 0);
            return total + walletSum;
        }, 0);
        return totalUSD * rate; // ПРИМЕНЯЕМ КОНВЕРТАЦИЮ
    }, [connectedWallets, coins, rate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#362F5E] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden flex-1 h-[220px] w-full max-w-[450px]"
        >
            {/* Декоративный фон */}
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
                        {/* 4. Ghost (Призрак) для фиксации ширины */}
                        <h2 className="text-5xl font-black tracking-tight invisible whitespace-nowrap">
                            {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                : `${currencySymbols[mainCurrency]}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </h2>

                        {/* 5. Видимый текст с логикой валют */}
                        <h2 className="text-5xl font-black tracking-tight absolute top-0 left-0 whitespace-nowrap">
                            {isVisible
                                ? (mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                    ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                    : `${currencySymbols[mainCurrency]}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                                : '••••••'}
                        </h2>
                    </div>

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