import { useState } from 'react';
import { Languages, DollarSign, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProfile } from '../../store/slices/authSlice';
import { setLanguage, type LanguageMode, setTheme } from '../../store/slices/uiSlice';
import {useTranslation} from "react-i18next";

const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', CZK: 'Kč', UAH: '₴'
};

export const AppProperties = () => {
    const dispatch = useAppDispatch();

    const { i18n } = useTranslation();

    const user = useAppSelector((state) => state.auth.user);
    const { theme, language } = useAppSelector((state) => state.ui);
    const currentTheme = user?.theme || theme;
    const isDark = currentTheme === 'dark';

    const mainCurrency = user?.mainCurrency || 'USD';

    const [langOpen, setLangOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        dispatch(setTheme(newTheme));
        dispatch(updateProfile({ theme: newTheme }));
    };

    const currencies = ['USD', 'EUR', 'CZK', 'UAH'];
    const languages = [
        { code: 'EN', name: 'English' },
        { code: 'CZ', name: 'Čeština' },
        { code: 'UA', name: 'Українська' }
    ];

    const handleLanguageChange = (code: LanguageMode) => {
        console.log("Смена языка на:", code);
        // 3. Меняем язык в самой библиотеке
        i18n.changeLanguage(code);
        // 4. Сохраняем в Redux/LocalStorage
        dispatch(setLanguage(code));
        // 5. Сохраняем в базу профиля
        dispatch(updateProfile({ language: code }));
        setLangOpen(false);
    };

    return (
        /* 1. ВНЕШНЯЯ ГРАДИЕНТНАЯ РАМКА (p-[1px]) */
        <div>
            {/* 2. ГЛАВНЫЙ КОНТЕЙНЕР (СТЕКЛО) */}
            <div className={`flex flex-wrap gap-4 items-center p-3 rounded-[31px] backdrop-blur-[20px] transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/80' : 'bg-white/70'}
            `}>

                {/* --- ЯЗЫКОВОЙ СЕЛЕКТ --- */}
                <div className="relative">
                    <button
                        onClick={() => {setLangOpen(!langOpen); setCurrencyOpen(false)}}
                        className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all cursor-pointer border
                            ${isDark
                            ? (langOpen ? 'bg-[#362F5E] border-white/20 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:text-white')
                            : (langOpen ? 'bg-[#362F5E] border-transparent text-white' : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200')
                        }
                        `}
                    >
                        <div className={`p-1 rounded-md ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <Languages size={18}/>
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest">{language}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {langOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={`absolute top-full mt-3 left-0 border rounded-2xl overflow-hidden z-[100] shadow-2xl min-w-[160px] backdrop-blur-2xl
                                    ${isDark ? 'bg-[#161B26] border-white/10' : 'bg-white border-slate-200'}
                                `}
                            >
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        className={`px-4 py-3 cursor-pointer text-xs font-bold transition-colors flex justify-between items-center
                                            ${language === lang.code
                                            ? 'bg-[#362F5E] text-white'
                                            : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')
                                        }
                                        `}
                                        onClick={() => handleLanguageChange(lang.code as LanguageMode)}
                                    >
                                        <span>{lang.name}</span>
                                        <span className="opacity-40 text-[9px] uppercase">{lang.code}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (PILL SWITCH) --- */}
                <div className={`flex items-center p-1.5 rounded-2xl border transition-colors
                    ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'}
                `}>
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleThemeChange('light')}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all ${currentTheme === 'light' ? 'bg-white text-orange-500 shadow-md' : 'text-slate-500 hover:text-slate-400'}`}
                    >
                        <Sun size={18}/>
                    </motion.div>
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleThemeChange('dark')}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all ${currentTheme === 'dark' ? 'bg-[#362F5E] text-white shadow-md' : 'text-slate-500 hover:text-slate-400'}`}
                    >
                        <Moon size={18}/>
                    </motion.div>
                </div>

                {/* --- СЕЛЕКТ ВАЛЮТЫ --- */}
                <div className="relative">
                    <button
                        onClick={() => {setCurrencyOpen(!currencyOpen); setLangOpen(false)}}
                        className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all cursor-pointer border
                            ${isDark
                            ? (currencyOpen ? 'bg-[#362F5E] border-white/20 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:text-white')
                            : (currencyOpen ? 'bg-[#362F5E] border-transparent text-white' : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200')
                        }
                        `}
                    >
                        <div className={`p-1 rounded-md ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            <DollarSign size={18}/>
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest">{mainCurrency}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${currencyOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {currencyOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={`absolute top-full mt-3 right-0 border rounded-2xl overflow-hidden z-[100] shadow-2xl min-w-[120px] backdrop-blur-2xl
                                    ${isDark ? 'bg-[#161B26] border-white/10' : 'bg-white border-slate-200'}
                                `}
                            >
                                {currencies.map((curr) => (
                                    <div
                                        key={curr}
                                        className={`px-4 py-3 cursor-pointer text-xs font-bold transition-colors flex justify-between items-center
                                            ${mainCurrency === curr
                                            ? 'bg-emerald-500 text-white'
                                            : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')
                                        }
                                        `}
                                        onClick={() => {
                                            dispatch(updateProfile({ mainCurrency: curr }));
                                            setCurrencyOpen(false);
                                        }}
                                    >
                                        <span>{curr}</span>
                                        <span className="opacity-50">{currencySymbols[curr]}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AppProperties;