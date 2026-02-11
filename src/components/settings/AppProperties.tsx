import { useState } from 'react';
import { Languages, DollarSign, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../store/slices/userSlice';
import {setTheme, setLanguage, type LanguageMode} from '../../store/slices/uiSlice';

export const AppProperties = () => {
    const dispatch = useAppDispatch();
    const { mainCurrency } = useAppSelector((state) => state.user);
    const { theme } = useAppSelector((state) => state.ui);

    // Local state for opening lists
    const [langOpen, setLangOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);

    const currencies = ['USD', 'EUR', 'CZK', 'UAH'];
    const languages = [
        { code: 'EN', name: 'English' },
        { code: 'CZ', name: 'Čeština' },
        { code: 'UA', name: 'Українська' }
    ];
    const { language } = useAppSelector((state) => state.ui);

    return (
        <div className='flex gap-4 h-max bg-slate-800/50 backdrop-blur-md p-4 rounded-3xl border border-white/10'>

            {/* Language select */}
            <div className="relative">
                <button
                    onClick={() => {setLangOpen(!langOpen); setCurrencyOpen(false)}}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
                        langOpen ? 'bg-[#362F5E] text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                >
                    <div className="bg-blue-500/20 text-blue-400 p-1 rounded-md">
                        <Languages size={18}/>
                    </div>

                    {/* Showing current language */}
                    <span className="font-bold uppercase">{language}</span>

                    <ChevronDown size={16} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {langOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full mt-2 left-0 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl w-40"
                        >
                            {languages.map((lang) => (
                                <div
                                    key={lang.code}
                                    className={`px-4 py-3 cursor-pointer text-sm transition-colors flex justify-between items-center ${
                                        language === lang.code ? 'bg-[#362F5E] text-white' : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                                    onClick={() => {
                                        dispatch(setLanguage(lang.code as LanguageMode));
                                        setLangOpen(false);
                                    }}
                                >
                                    <span>{lang.name}</span>
                                    {/* language icon in list option */}
                                    <span className="text-[10px] opacity-50">{lang.code}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Theme swithcer */}
            <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-white/5">
                <div
                    onClick={() => dispatch(setTheme('light'))}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-lg' : 'text-slate-500'}`}
                >
                    <Sun size={20}/>
                </div>
                <div
                    onClick={() => dispatch(setTheme('dark'))}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${theme === 'dark' ? 'bg-[#362F5E] text-white shadow-lg' : 'text-slate-500'}`}
                >
                    <Moon size={20}/>
                </div>
            </div>

            {/* Currency select */}
            <div className="relative">
                <button
                    onClick={() => {setCurrencyOpen(!currencyOpen); setLangOpen(false)}}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${currencyOpen ? 'bg-[#362F5E] text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                    <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-md">
                        <DollarSign size={18}/>
                    </div>
                    <span className="font-bold">{mainCurrency}</span>
                    <ChevronDown size={16} className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {currencyOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full mt-2 right-0 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl w-32"
                        >
                            {currencies.map((curr) => (
                                <div
                                    key={curr}
                                    className={`px-4 py-3 cursor-pointer text-sm transition-colors ${mainCurrency === curr ? 'bg-emerald-500 text-slate-900 font-bold' : 'text-white hover:bg-slate-800'}`}
                                    onClick={() => {
                                        dispatch(updateUser({ mainCurrency: curr }));
                                        setCurrencyOpen(false);
                                    }}
                                >
                                    {curr}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AppProperties;