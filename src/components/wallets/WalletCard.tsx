/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';
import { Copy, Trash2, Wallet, RefreshCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { deleteSourceFromDb, fetchSourceBalances, syncExchangeBalances } from '../../store/slices/walletSlice';
import { addToast } from '../../store/slices/toastSlice';
import { motion } from 'framer-motion';

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

interface WalletCardProps {
    wallet: any;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
    const dispatch = useAppDispatch();

    // Достаем тему и данные для расчетов
    const { theme } = useAppSelector(state => state.ui);
    const { coins, fiatRates } = useAppSelector(state => state.market);
    const { user } = useAppSelector(state => state.auth);

    const isDark = theme === 'dark';
    const mainCurrency = user?.mainCurrency || 'USD';
    const fiatRate = fiatRates[mainCurrency] || 1;

    const refreshData = () => {
        if (wallet.type === 'exchange') {
            dispatch(syncExchangeBalances({
                id: wallet.id,
                platform: wallet.platform,
                apiKey: wallet.apiKey,
                apiSecret: wallet.apiSecret,
                passphrase: wallet.passphrase
            }));
        } else if (wallet.type === 'web3') {
            dispatch(fetchSourceBalances(wallet));
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const walletValueInCurrency = useMemo(() => {
        const assets = wallet.assets || [];
        const totalUSD = assets.reduce((sum: number, asset: any) => {
            const marketCoin = coins.find(c =>
                c.symbol.toLowerCase() === asset.symbol.toLowerCase()
            );
            const price = asset.price || marketCoin?.current_price || 0;
            return sum + (asset.amount * price);
        }, 0);
        return totalUSD * fiatRate;
    }, [wallet.assets, coins, fiatRate]);

    // Безопасный расчет короткого адреса (используем apiKey как универсальное поле)
    const displayAddress = wallet.apiKey || '';
    const shortAddress = displayAddress.length > 10
        ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`
        : displayAddress;

    const copyToClipboard = () => {
        if (!displayAddress) return;
        navigator.clipboard.writeText(displayAddress);
        dispatch(addToast({ message: "Address copied!", type: 'info' }));
    };

    return (
        /* 1. ВНЕШНИЙ КОНТУР (Градиентная рамка) */
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-[1px] rounded-[32px] overflow-hidden transition-all duration-500 shadow-xl group
                ${isDark
                ? 'bg-gradient-to-br from-white/10 to-transparent shadow-black/20'
                : 'bg-gradient-to-br from-slate-200 to-white shadow-slate-200'}
            `}
        >
            {/* АКЦЕНТНАЯ ПОЛОСА СЛЕВА */}
            <div className="absolute top-0 left-0 w-1.5 h-full z-20" style={{ backgroundColor: wallet.color }} />

            {/* 2. ВНУТРЕННИЙ КОНТЕЙНЕР (Стекло) */}
            <div className={`relative z-10 p-6 rounded-[31px] backdrop-blur-xl h-full flex flex-col justify-between transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/80' : 'bg-white/90'}
            `}>

                {/* ВЕРХНЯЯ ЧАСТЬ */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-colors ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-[#362F5E]'}`}>
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h4 className={`font-black text-lg leading-none transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {wallet.label}
                            </h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-widest">
                                {wallet.platform} {wallet.type === 'exchange' ? 'Account' : 'Network'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={refreshData}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-black/5'} ${wallet.isLoading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCcw size={16} />
                        </button>
                        <button
                            onClick={() => dispatch(deleteSourceFromDb(wallet.id))}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* СРЕДНЯЯ ЧАСТЬ: БАЛАНС */}
                <div className="my-4 relative z-10">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-tighter mb-1 opacity-70">Estimated Value</p>
                    <h3 className={`text-3xl font-black tracking-tighter tabular-nums transition-colors ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                        {wallet.isLoading ? (
                            <span className="text-slate-500 animate-pulse text-xl uppercase font-bold tracking-widest">Scanning...</span>
                        ) : (
                            mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                ? `${walletValueInCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                : `${currencySymbols[mainCurrency]}${walletValueInCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                    </h3>

                    {/* СПИСОК АКТИВОВ */}
                    <div className="flex gap-2 mt-3 flex-wrap max-h-[80px] overflow-y-auto custom-scrollbar">
                        {wallet.assets && wallet.assets.length > 0 ? (
                            wallet.assets.map((asset: any) => (
                                <span key={asset.symbol} className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border transition-colors
                                    ${isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}
                                `}>
                                    {asset.amount > 0.001 ? asset.amount.toFixed(3) : asset.amount.toFixed(6)} {asset.symbol}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-slate-500 italic opacity-50">
                                {!wallet.isLoading && "No assets found"}
                            </span>
                        )}
                    </div>
                </div>

                {/* НИЖНЯЯ ПАНЕЛЬ */}
                <div className={`rounded-2xl p-3 flex justify-between items-center border transition-all z-10
                    ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}
                `}>
                    {wallet.type === 'exchange' ? (
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Live Connection
                        </span>
                    ) : (
                        <>
                            <code className={`text-xs font-mono font-bold ${isDark ? 'text-blue-400/80' : 'text-blue-600'}`}>
                                {shortAddress || 'No address'}
                            </code>
                            <button onClick={copyToClipboard} className={`p-1 transition-colors cursor-pointer ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                                <Copy size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};