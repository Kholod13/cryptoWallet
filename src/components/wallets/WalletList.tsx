import { useAppSelector } from '../../store';
import { WalletCard } from './WalletCard';
import { AnimatePresence } from 'framer-motion';
import { Cable } from 'lucide-react';
import {useTranslation} from "react-i18next";

export const WalletList = () => {
    const { connectedWallets } = useAppSelector((state) => state.wallet);

    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#362F5E] rounded-xl text-white">
                        <Cable size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[#362F5E]  tracking-tight">{t('wallets.title')}</h3>
                        <p className="text-xs text-slate-500 font-medium">{connectedWallets.length} {t('wallets.connections')}</p>
                    </div>
                </div>
            </div>

            {connectedWallets.length === 0 ? (
                <div className="bg-white/50 border-4 border-slate-800/50 border-dashed p-20 rounded-[40px] text-center transition-all duration-300">
                    <p className="text-slate-400 font-bold">{t('wallets.no_wallets')}</p>
                    <p className="text-slate-600 text-sm mt-1">{t('wallets.no_wallets_text')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {connectedWallets.map((wallet) => (
                            <WalletCard key={wallet.id} wallet={wallet}  />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default WalletList;