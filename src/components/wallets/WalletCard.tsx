/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';
import { Copy, Trash2, Wallet, RefreshCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
// Импортируем оба экшена: для кошельков и для бирж
import {
    deleteSourceFromDb,
    fetchSourceBalances,
    syncExchangeBalances
} from '../../store/slices/walletSlice';
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

    const { coins, fiatRates } = useAppSelector(state => state.market);
    const { user } = useAppSelector(state => state.auth);
    const mainCurrency = user?.mainCurrency || 'USD';
    const fiatRate = fiatRates[mainCurrency] || 1;

    // 1. ЛОГИКА ОБНОВЛЕНИЯ ДАННЫХ
    const refreshData = () => {
        if (wallet.type === 'exchange') {
            // Если это биржа - шлем ключи на наш бэкенд
            dispatch(syncExchangeBalances({
                id: wallet.id,
                platform: wallet.platform,
                apiKey: wallet.apiKey,
                apiSecret: wallet.apiSecret,
                passphrase: wallet.passphrase
            }));
        } else if (wallet.type === 'web3') {
            // Если это MetaMask/Address - шлем запрос в блокчейн
            dispatch(fetchSourceBalances(wallet));
        }
    };

    // 2. АВТО-ЗАГРУЗКА ПРИ СТАРТЕ
    useEffect(() => {
        refreshData();
    }, []); // Сработает один раз при монтировании

    const walletValueInCurrency = useMemo(() => {
        // ЗАЩИТА: Если assets еще не загружены, используем пустой массив
        const currentAssets = wallet.assets || [];

        const totalUSD = currentAssets.reduce((sum: number, asset: any) => {
            const marketCoin = coins.find(c =>
                c.symbol.toLowerCase() === asset.symbol.toLowerCase()
            );
            const price = marketCoin?.current_price || 0;
            return sum + (asset.amount * price);
        }, 0);

        return totalUSD * fiatRate;
    }, [wallet.assets, coins, fiatRate]);

    const copyToClipboard = () => {
        if (!wallet.apiKey) return;
        navigator.clipboard.writeText(wallet.apiKey);
        dispatch(addToast({ message: "Address copied!", type: 'info' }));
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-800/60 border border-white/10 p-6 rounded-[32px] backdrop-blur-md overflow-hidden min-h-[200px] flex flex-col justify-between shadow-xl group"
        >
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: wallet.color }} />

            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10">
                        <Wallet size={20} className="text-slate-300" />
                    </div>
                    <div className=''>
                        <h4 className="text-white font-bold text-2xl leading-none">{wallet.label}</h4>
                        <p className="text-slate-700 text-[10px] font-bold uppercase mt-1 tracking-widest">
                            {wallet.platform} {wallet.type === 'exchange' ? 'Account' : 'Network'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* КНОПКА РУЧНОГО ОБНОВЛЕНИЯ */}
                    <button
                        onClick={refreshData}
                        className={`p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer ${wallet.isLoading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCcw size={16} />
                    </button>
                    <button onClick={() => {
                        // Вызываем асинхронное удаление
                        dispatch(deleteSourceFromDb(wallet.id));
                        dispatch(addToast({ message: "Deleting wallet...", type: 'info' }));
                    }} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="my-4 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter tabular-nums">
                    {wallet.isLoading ? "..." :
                        mainCurrency === 'CZK' || mainCurrency === 'UAH'
                            ? `${walletValueInCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                            : `${currencySymbols[mainCurrency]}${walletValueInCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    }
                </h3>

                {/* СПИСОК АКТИВОВ ВНУТРИ КАРТОЧКИ */}
                <div className="flex gap-2 mt-2 flex-wrap">
                    {wallet.assets.length > 0 ? (
                        wallet.assets.map((asset: any) => (
                            <span key={asset.symbol} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-slate-300 border border-white/5 font-bold uppercase">
                                {asset.amount > 0.001 ? asset.amount.toFixed(3) : asset.amount.toFixed(6)} {asset.symbol}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-600 italic">No assets found</span>
                    )}
                </div>
            </div>

            {/* НИЖНЯЯ ПАНЕЛЬ (Адрес или Статус API) */}
            <div className="bg-black/20 rounded-2xl p-3 flex justify-between items-center border border-white/5 z-10">
                {wallet.type === 'exchange' ? (
                    <span className="text-emerald-400 text-xs font-bold px-1">● Connection Active</span>
                ) : (
                    <>
                        <code className="text-blue-400/80 text-xs font-mono">
                            {wallet.apiKey ? `${wallet.apiKey.slice(0, 6)}...${wallet.apiKey.slice(-4)}` : 'No address'}
                        </code>
                        <button onClick={copyToClipboard} className="p-1 text-slate-500 hover:text-white cursor-pointer transition-colors">
                            <Copy size={14} />
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
};