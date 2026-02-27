import { useEffect } from 'react';
import { Copy, Trash2, RefreshCcw } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { deleteWallet, fetchWalletBalance } from '../../store/slices/walletSlice';
import { addToast } from '../../store/slices/toastSlice';
import { motion } from 'framer-motion';

// Обновляем интерфейс пропсов, чтобы включить новые поля из Redux
interface WalletCardProps {
    wallet: {
        id: string;
        label: string;
        address: string;
        currency: string;
        color: string;
        balance: number;   // Из Redux
        isLoading?: boolean; // Из Redux
        isManual: false;
    }
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
    const dispatch = useAppDispatch();

    // Функция для сокращения адреса (0x1234...5678)
    const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;

    // 1. Автоматический запрос баланса при загрузке карточки
    useEffect(() => {
        // Делаем запрос только если это НЕ ручной ввод и есть адрес
        if (!wallet.isManual && wallet.address) {
            dispatch(fetchWalletBalance({
                id: wallet.id,
                address: wallet.address,
                network: wallet.currency
            }));
        }
    }, [dispatch, wallet.id, wallet.address, wallet.currency, wallet.isManual]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(wallet.address);
        dispatch(addToast({ message: "Address copied!", type: 'info' }));
    };

    const handleRefresh = () => {
        dispatch(fetchWalletBalance({
            id: wallet.id,
            address: wallet.address,
            network: wallet.currency
        }));
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group bg-slate-800/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md overflow-hidden min-h-[180px] flex flex-col justify-between"
        >
            {/* Цветная полоска слева */}
            <div
                className="absolute top-0 left-0 w-1.5 h-full transition-all duration-500"
                style={{ backgroundColor: wallet.color }}
            />

            {/* ВЕРХНЯЯ ЧАСТЬ: Название и Кнопки управления */}
            <div className="flex justify-between items-start z-10">
                <div>
                    <h4 className="text-white font-bold text-lg leading-none mb-1">{wallet.label}</h4>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{wallet.currency} Network</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleRefresh}
                        className={`p-2 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer ${wallet.isLoading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCcw size={16} />
                    </button>
                    <button
                        onClick={() => dispatch(deleteWallet(wallet.id))}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* СРЕДНЯЯ ЧАСТЬ: Живой Баланс */}
            <div className="my-4 z-10">
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Available Balance</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        {wallet.isLoading ? (
                            <span className="animate-pulse text-slate-600">...</span>
                        ) : (
                            wallet.balance?.toLocaleString(undefined, { minimumFractionDigits: 4 })
                        )}
                    </h3>
                    <span className="text-sm font-bold text-emerald-400">{wallet.currency}</span>
                </div>
            </div>

            {/* НИЖНЯЯ ЧАСТЬ: Адрес */}
            <div className="bg-black/30 rounded-2xl p-3 flex justify-between items-center border border-white/5 z-10">
                <code className="text-blue-400/80 text-xs font-mono">{shortAddress}</code>
                <button
                    onClick={copyToClipboard}
                    className="p-1.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                    <Copy size={14} />
                </button>
            </div>

            {/* Декоративный элемент на фоне */}
            <div className="absolute -right-4 -bottom-6 opacity-5 pointer-events-none select-none">
                <p className="text-8xl font-black text-white italic">{wallet.currency.slice(0, 1)}</p>
            </div>
        </motion.div>
    );
};

export default WalletCard;