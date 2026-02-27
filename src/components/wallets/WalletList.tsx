import { useAppSelector } from '../../store';
import { WalletCard } from './WalletCard';
import { AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon } from 'lucide-react';

export const WalletList = () => {
    const { connectedWallets } = useAppSelector((state) => state.wallet);

    return (
        <div className="flex flex-col gap-4 bg-gray-500 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
                <WalletIcon size={20} />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Wallets</h3>
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md text-xs font-bold">
                    {connectedWallets.length}
                </span>
            </div>

            {connectedWallets.length === 0 ? (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 p-10 rounded-[32px] text-center">
                    <p className="text-slate-400 font-medium">No wallets connected yet. Add your first wallet in Settings!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {connectedWallets.map((wallet) => (
                            <WalletCard key={wallet.id} wallet={wallet} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default WalletList;