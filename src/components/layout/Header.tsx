import { useState } from 'react';
import {
    Search, Bell, Trophy, UserRoundIcon, CircleHelp, X, Info, ShieldCheck, Key, Lock, Wallet, PieChart
} from 'lucide-react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../store/';
import { createPortal } from 'react-dom';
import {useTranslation} from "react-i18next";

export const Header = () => {
    const { pageTitleKey, theme } = useAppSelector((state) => state.ui);
    const user = useAppSelector((state) => state.auth.user);

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const isDark = theme === 'dark';
    const username = user?.username || 'Guest';
    const profession = user?.profession || 'User';
    const tempAvatar = user?.avatarUrl || '';

    const { t } = useTranslation();

    return (
        <header className={`
            flex px-4 md:px-8 py-3 md:py-4 justify-between items-center sticky top-0 z-[100] transition-all duration-500 border-b
            ${isDark ? 'bg-[#12141C]/80 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'} 
            backdrop-blur-md
        `}>
            {/* 1. Блок заголовка: на мобилках занимает меньше места */}
            <div className="flex-shrink-0 lg:w-1/4">
                <h1 className={`text-lg md:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {t(pageTitleKey)}
                </h1>
            </div>

            {/* 2. Поиск: скрываем на мобилках (до 768px), оставляем на десктопе */}
            <div className={`
                hidden md:flex items-center px-4 py-2 gap-3 rounded-2xl w-1/3 transition-all duration-500 border
                ${isDark ? 'bg-white/5 border-white/10 text-white/75' : 'bg-slate-100 border-slate-200 focus-within:bg-white text-slate-900'}
            `}>
                <Search size={18} className="text-slate-500" />
                <input
                    type="text"
                    placeholder={t('header.search')}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
                />
            </div>

            {/* 3. Правая часть: кнопки и профиль */}
            <div className="flex items-center gap-2 md:gap-6">

                {/* Кнопки уведомлений: на мобилках оставляем только Bell для экономии места */}
                <div className="flex items-center gap-1 md:gap-3">
                    <button className={`p-2 md:p-2.5 rounded-xl border transition-all cursor-pointer
                        ${isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600'}`}>
                        <Bell size={18} />
                    </button>
                    {/* Кнопка Трофея видна только с планшета */}
                    <button className={`hidden sm:block p-2 md:p-2.5 rounded-xl border transition-all cursor-pointer
                        ${isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600'}`}>
                        <Trophy size={18} />
                    </button>
                </div>

                <div className={`hidden md:block w-[1px] h-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

                <div className="flex items-center gap-2 md:gap-5">
                    {/* Кнопка помощи: чуть меньше на мобилках */}
                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="cursor-pointer hover:scale-110 transition-transform text-slate-500 hover:text-blue-500"
                    >
                        <CircleHelp size={24} />
                    </button>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Имя и профессия: скрываем на мобилках до 1024px (lg) */}
                        <div className="hidden lg:block text-right">
                            <p className={`font-black text-sm leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{username}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-50">{profession}</p>
                        </div>

                        {/* Аватарка: 10 h-10 на мобилках, 12 h-12 на десктопе */}
                        <Link to="/settings" className="cursor-pointer">
                            <div className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 transition-all duration-500
                                ${isDark ? 'bg-slate-800 border-white/10 group-hover:border-blue-500' : 'bg-slate-200 border-white shadow-sm group-hover:border-blue-500'}
                            `}>
                                {tempAvatar ? (
                                    <img src={tempAvatar} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserRoundIcon size={20} className="text-slate-400" />
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
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
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
                                // Адаптивные отступы p-6 для мобилок, p-10 для десктопа
                                // Адаптивное закругление rounded-3xl для мобилок
                                className={`relative w-full max-w-xl rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-2xl border overflow-hidden
                    ${isDark ? 'bg-[#161B26] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}
                `}
                            >
                                {/* Декоративное свечение — уменьшено для мобилок */}
                                <div className="absolute -top-24 -right-24 w-32 h-32 md:w-48 md:h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 md:gap-3">
                                            <Info className="text-blue-500" size={24} />
                                            {t('connection_guide.title')}
                                        </h3>
                                        <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                                            {t('connection_guide.undertitle')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsHelpOpen(false)}
                                        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                {/* Скролл-зона: max-h ограничена для маленьких экранов */}
                                <div className="space-y-6 md:space-y-8 overflow-y-auto max-h-[50vh] md:max-h-[60vh] pr-2 md:pr-4 custom-scrollbar relative z-10 text-left">

                                    {/* Section 1: Web3 */}
                                    <div className="flex gap-4 md:gap-5">
                                        <div className={`p-2.5 md:p-3.5 h-fit rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-500 border ${isDark ? 'border-blue-500/20' : 'border-blue-500/10'}`}>
                                            <Wallet size={20} className="md:w-6 md:h-6"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base md:text-lg">{t('connection_guide.web3.title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                                {t('connection_guide.web3.description')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section 2: CEX */}
                                    <div className="flex gap-4 md:gap-5">
                                        <div className={`p-2.5 md:p-3.5 h-fit rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 border ${isDark ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>
                                            <Key size={20} className="md:w-6 md:h-6"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base md:text-lg">{t('connection_guide.exchanges.title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                                {t('connection_guide.exchanges.description')}
                                            </p>
                                            <div className="mt-2 p-2.5 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-start gap-2">
                                                <ShieldCheck size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-[10px] md:text-[11px] text-amber-600 italic font-medium leading-tight">
                                                    {t('connection_guide.exchanges.critical')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: OKX */}
                                    <div className="flex gap-4 md:gap-5">
                                        <div className={`p-2.5 md:p-3.5 h-fit rounded-xl md:rounded-2xl bg-amber-500/10 text-amber-400 border ${isDark ? 'border-amber-500/20' : 'border-amber-500/10'}`}>
                                            <Lock size={20} className="md:w-6 md:h-6"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base md:text-lg">{t('connection_guide.okx.title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                                {t('connection_guide.okx.description')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section 4: Analytics */}
                                    <div className="flex gap-4 md:gap-5">
                                        <div className={`p-2.5 md:p-3.5 h-fit rounded-xl md:rounded-2xl bg-purple-500/10 text-purple-500 border ${isDark ? 'border-purple-500/20' : 'border-purple-500/10'}`}>
                                            <PieChart size={20} className="md:w-6 md:h-6"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base md:text-lg">{t('connection_guide.analytics.title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                                {t('connection_guide.analytics.description')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsHelpOpen(false)}
                                    className="w-full mt-6 md:mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-3 md:py-4 rounded-xl md:rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/30 cursor-pointer text-sm md:text-base"
                                >
                                    {t('connection_guide.button')}
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