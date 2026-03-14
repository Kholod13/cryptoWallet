import { useState } from 'react';
import { Search, Bell, Trophy, UserRoundIcon, CircleHelp, X, Info, ShieldCheck, PieChart, Activity } from 'lucide-react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import { type RootState, useAppSelector } from '../../store/';

export const Header = () => {
    const title = useSelector((state: RootState) => state.ui.pageTitle);
    const user = useAppSelector((state) => state.auth.user);

    // Состояние для модалки помощи
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const username = user?.username || 'Loading...';
    const profession = user?.profession || 'User';
    const tempAvatar = user?.avatarUrl || '';

    return (
        <header className="flex px-6 py-4 justify-between items-center bg-gray-100 relative">
            {/* Title */}
            <p className="text-slate-600 font-bold text-2xl w-1/8">{title}</p>

            {/* Input */}
            <div className="flex bg-gray-300 p-4 gap-5 rounded-xl w-1/3">
                <Search />
                <input type="text" placeholder="Search here"
                       className="border-none outline-none focus:ring-0 text-gray-600 w-full bg-transparent"/>
            </div>

            {/* Message buttons */}
            <div className="flex items-center gap-5">
                <button className="border-2 p-3 rounded-xl border-[#362F5E] hover:bg-gray-300 cursor-pointer transition-all duration-300">
                    <Bell />
                </button>
                <button className="border-2 p-3 rounded-xl border-[#362F5E] hover:bg-gray-300 cursor-pointer transition-all duration-300">
                    <Trophy />
                </button>
            </div>

            {/* Profile info */}
            <div className="flex items-center gap-5 px-5 h-full">
                {/* Кнопка помощи */}
                <div
                    onClick={() => setIsHelpOpen(true)}
                    className="cursor-pointer hover:scale-110 transition-transform text-gray-500 hover:text-[#362F5E]"
                >
                    <CircleHelp size={32} />
                </div>

                <Link to="/settings" className="cursor-pointer">
                    <div className="relative group flex items-center justify-center w-14 h-14 bg-gray-400 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg">
                        {tempAvatar ? (
                            <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserRoundIcon size={30} className="text-slate-300" />
                        )}
                    </div>
                </Link>
                <div className="hidden md:block">
                    <p className="font-bold text-lg leading-none">{username}</p>
                    <p className="text-gray-500 text-xs mt-1">{profession}</p>
                </div>
            </div>

            {/* --- ВСПЛЫВАЮЩЕЕ ОКНО ПОМОЩИ (MODAL) --- */}
            <AnimatePresence>
                {isHelpOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHelpOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#161B26] border border-white/10 w-full max-w-lg rounded-[32px] p-8 shadow-2xl text-white"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                    <Info className="text-blue-400" />
                                    How to use ChainDeck
                                </h3>
                                <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                                {/* Step 1 */}
                                <div className="flex gap-4">
                                    <div className="p-3 h-fit bg-blue-500/10 rounded-2xl text-blue-400"><ShieldCheck size={24}/></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Connect Your Assets</h4>
                                        <p className="text-sm text-slate-400">Go to the <b>Wallets</b> section to link your MetaMask, Trust Wallet, or Exchange accounts (Binance/OKX). We use <b>read-only</b> access to keep your funds safe.</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-4">
                                    <div className="p-3 h-fit bg-emerald-500/10 rounded-2xl text-emerald-400"><Activity size={24}/></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Monitor Real-time Balance</h4>
                                        <p className="text-sm text-slate-400">Your <b>Total Balance</b> on the Dashboard automatically aggregates data from all connected sources and converts it to your preferred currency.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-4">
                                    <div className="p-3 h-fit bg-purple-500/10 rounded-2xl text-purple-400"><PieChart size={24}/></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Analyze Portfolio</h4>
                                        <p className="text-sm text-slate-400">Use our <b>Distribution Chart</b> to see which coins dominate your portfolio and track your <b>PnL performance</b> over time.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsHelpOpen(false)}
                                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer"
                            >
                                Got it, let's go!
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;