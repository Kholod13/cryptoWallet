import { useState } from 'react';
import {
    Search, Bell, Trophy, UserRoundIcon, CircleHelp, X, Info, ShieldCheck, Key, Lock, Wallet, PieChart
} from 'lucide-react';
import { Link } from "react-router-dom";
//import { useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import { /*type RootState,*/ useAppSelector } from '../../store/';
import { createPortal } from 'react-dom';
import {useTranslation} from "react-i18next";

export const Header = () => {
    //const title = useSelector((state: RootState) => state.ui.pageTitle);
    const { theme } = useAppSelector((state) => state.ui);
    const user = useAppSelector((state) => state.auth.user);

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const isDark = theme === 'dark';
    const username = user?.username || 'Guest';
    const profession = user?.profession || 'User';
    const tempAvatar = user?.avatarUrl || '';

    const { t } = useTranslation();

    return (
        <header className={`
            flex px-8 py-4 justify-between items-center sticky top-0 z-[100] transition-all duration-500 border-b
            ${isDark ? 'bg-[#12141C]/80 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'} 
            backdrop-blur-md
        `}>
            {/* Title */}
            <div className="w-1/4">
                <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {t('common.dashboard')}
                </h1>
            </div>

            {/* Search */}
            <div className={`
                flex items-center px-4 py-2.5 gap-3 rounded-2xl w-1/3 transition-all duration-500 border
                ${isDark ? 'bg-white/5 border-white/10 text-white/75' : 'bg-slate-100 border-slate-200 focus-within:bg-white text-slate-900'}
            `}>
                <Search size={18} className="text-slate-500" />
                <input
                    type="text"
                    placeholder="Search assets..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
                />
            </div>

            {/* Icons & Profile */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    {[Bell, Trophy].map((Icon, idx) => (
                        <button key={idx} className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer
                            ${isDark ? 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}
                        `}>
                            <Icon size={20} />
                        </button>
                    ))}
                </div>

                <div className={`w-[1px] h-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

                <div className="flex items-center gap-5 h-full">
                    {/* КНОПКА ПОМОЩИ */}
                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="cursor-pointer hover:scale-110 transition-transform text-slate-500 hover:text-blue-500"
                    >
                        <CircleHelp size={28} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block text-right">
                            <p className={`font-black text-sm leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{username}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-50">{profession}</p>
                        </div>
                        <Link to="/settings" className="cursor-pointer group">
                            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all duration-500
                                ${isDark ? 'bg-slate-800 border-white/10 group-hover:border-blue-500' : 'bg-slate-200 border-white shadow-sm group-hover:border-blue-500'}
                            `}>
                                {tempAvatar ? (
                                    <img src={tempAvatar} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserRoundIcon size={24} className="text-slate-400" />
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- ПОРТАЛ ДЛЯ МОДАЛКИ (Теперь она будет строго по центру экрана) --- */}
            {createPortal(
                <AnimatePresence>
                    {isHelpOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsHelpOpen(false)}
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`relative w-full max-w-xl rounded-[40px] p-10 shadow-2xl border overflow-hidden
                                    ${isDark ? 'bg-[#161B26] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}
                                `}
                            >
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                            <Info className="text-blue-500" size={28} />
                                            Connection Guide
                                        </h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Everything you need to know</p>
                                    </div>
                                    <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer">
                                        <X size={24} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar relative z-10 text-left">

                                    {/* Web3 Section */}
                                    <div className="flex gap-5">
                                        <div className={`p-3.5 h-fit rounded-2xl bg-blue-500/10 text-blue-500 border ${isDark ? 'border-blue-500/20' : 'border-blue-500/10'}`}>
                                            <Wallet size={24}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Web3 Wallets (MetaMask, Trust)</h4>
                                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Just copy your <span className="font-mono font-bold text-blue-500">Public Address</span> (starts with 0x...). Paste it into the address field. <b>Never</b> enter your recovery phrase or private keys.
                                            </p>
                                        </div>
                                    </div>

                                    {/* CEX Section */}
                                    <div className="flex gap-5">
                                        <div className={`p-3.5 h-fit rounded-2xl bg-emerald-500/10 text-emerald-500 border ${isDark ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>
                                            <Key size={24}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Centralized Exchanges</h4>
                                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Go to your Exchange settings and find <b>API Management</b>. Generate an <b>API Key</b> and <b>API Secret</b>.
                                            </p>
                                            <div className="mt-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-start gap-3">
                                                <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-amber-600 italic font-medium leading-tight">
                                                    CRITICAL: Always set permissions to <b>"Read-only"</b>. Disable Withdrawals and Trading for security.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* OKX Specifics */}
                                    <div className="flex gap-5">
                                        <div className={`p-3.5 h-fit rounded-2xl bg-amber-500/10 text-amber-500 border ${isDark ? 'border-amber-500/20' : 'border-amber-500/10'}`}>
                                            <Lock size={24}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">OKX Special Requirements</h4>
                                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Unlike other exchanges, OKX requires a <span className="font-bold text-amber-500">Passphrase</span>. This is a password you create specifically for the API key. You must provide all three: Key, Secret, and Passphrase.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Analytics */}
                                    <div className="flex gap-5">
                                        <div className={`p-3.5 h-fit rounded-2xl bg-purple-500/10 text-purple-500 border ${isDark ? 'border-purple-500/20' : 'border-purple-500/10'}`}>
                                            <PieChart size={24}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Analytics & Balance</h4>
                                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Once connected, your dashboard will automatically aggregate all tokens and calculate your <b>Total Net Worth</b> in real-time.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsHelpOpen(false)}
                                    className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/30 cursor-pointer"
                                >
                                    Got it, let's track!
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </header>
    );
};

export default Header;