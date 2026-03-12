import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../store';
import {
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    CheckCircle2,
    Clock,
    ExternalLink
} from 'lucide-react';

// Имитация данных транзакций
const MOCK_TRANSACTIONS = [
    { id: '1', type: 'received', asset: 'BTC', amount: 0.025, status: 'success', date: '2026-03-11T14:20:00', hash: '0x74a...f2e' },
    { id: '2', type: 'sent', asset: 'ETH', amount: 1.5, status: 'pending', date: '2026-03-12T09:15:00', hash: '0x12b...e4a' },
    { id: '3', type: 'swap', asset: 'SOL', amount: 45.0, status: 'success', date: '2026-03-10T18:45:00', hash: '0x99d...a11' },
    { id: '4', type: 'received', asset: 'USDT', amount: 500.0, status: 'success', date: '2026-03-08T12:00:00', hash: '0x55c...33b' },
];

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const TransactionHistory = () => {
    const { user } = useAppSelector(state => state.auth);
    const { coins, fiatRates } = useAppSelector(state => state.market);

    const mainCurrency = user?.mainCurrency || 'USD';
    const rate = fiatRates[mainCurrency] || 1;

    return (
        <div className="relative p-[1px] rounded-[48px] overflow-hidden bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
            <div className="relative z-10 bg-[#0D0F14] rounded-[47px] p-8 overflow-hidden flex flex-col h-full">

                {/* ФОНОВОЕ СВЕЧЕНИЕ */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-20">
                    {/* ХЕДЕР БЛОКА */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Recent Activity</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">On-chain Transactions</p>
                        </div>
                        <button className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
                            <ExternalLink size={18} />
                        </button>
                    </div>

                    {/* СПИСОК ТРАНЗАКЦИЙ */}
                    <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {MOCK_TRANSACTIONS.map((tx, index) => {
                                const marketCoin = coins.find(c => c.symbol.toLowerCase() === tx.asset.toLowerCase());
                                const fiatValue = tx.amount * (marketCoin?.current_price || 0) * rate;

                                return (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                                        className="flex items-center justify-between p-4 rounded-[24px] bg-white/[0.02] border border-white/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* ИКОНКА ТИПА ТРАНЗАКЦИИ */}
                                            <div className={`p-3 rounded-2xl ${
                                                tx.type === 'received' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    tx.type === 'sent' ? 'bg-rose-500/10 text-rose-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                            }`}>
                                                {tx.type === 'received' && <ArrowDownLeft size={20} />}
                                                {tx.type === 'sent' && <ArrowUpRight size={20} />}
                                                {tx.type === 'swap' && <RefreshCw size={20} />}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-white text-sm uppercase tracking-tight">
                                                        {tx.type} {tx.asset}
                                                    </p>
                                                    {tx.status === 'success' ?
                                                        <CheckCircle2 size={12} className="text-emerald-500/50" /> :
                                                        <Clock size={12} className="text-amber-500/50 animate-pulse" />
                                                    }
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.hash}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`font-black text-sm tabular-nums ${
                                                tx.type === 'received' ? 'text-emerald-400' : 'text-white'
                                            }`}>
                                                {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.asset}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">
                                                {mainCurrency === 'CZK' || mainCurrency === 'UAH'
                                                    ? `${fiatValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currencySymbols[mainCurrency]}`
                                                    : `${currencySymbols[mainCurrency]}${fiatValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                                                }
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* КНОПКА "VIEW ALL" */}
                    <button className="w-full mt-6 py-4 rounded-[20px] bg-white/5 border border-white/5 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                        See All Transactions
                    </button>
                </div>

                {/* ТЕКСТУРА ШУМА */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>
        </div>
    );
};

export default TransactionHistory;