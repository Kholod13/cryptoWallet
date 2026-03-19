import { Handshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../store';
import {useTranslation} from "react-i18next";

export const Contact = () => {
    const { theme } = useAppSelector(state => state.ui);
    const [isScrolling, setIsScrolling] = useState(false);
    const isDark = theme === 'dark';

    const { t } = useTranslation();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                setIsScrolling(false);
            }, 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <motion.div
            // Анимация контейнера-рамки
            animate={{
                borderRadius: isScrolling ? "50%" : "32px",
                scale: isScrolling ? 0.85 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            className={`relative p-[1px] shadow-2xl m-3 w-max h-max overflow-hidden transition-all duration-500
                ${isDark
                ? 'bg-gradient-to-br from-white/10 to-transparent'
                : 'bg-gradient-to-br from-slate-200 to-slate-300'}
            `}
        >
            {/* ВНУТРЕННИЙ КОНТЕЙНЕР (Стекло) */}
            <motion.div
                animate={{
                    borderRadius: isScrolling ? "50%" : "31px",
                    // Если скроллим — делаем блок квадратным для идеального круга
                    width: isScrolling ? "100px" : "auto",
                    height: isScrolling ? "100px" : "auto",
                }}
                className={`relative z-10 flex flex-col items-center justify-center p-8 backdrop-blur-[20px] transition-colors duration-500
                    ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
                `}
            >
                {/* ИКОНКА (с эффектом вращения при наведении на родителя) */}
                <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`${isDark ? 'text-white' : 'text-[#362F5E]'}`}
                >
                    <Handshake size={isScrolling ? 40 : 80} className="transition-all duration-300" />
                </motion.div>

                {/* КОНТЕНТ (Скрывается при скролле) */}
                <AnimatePresence>
                    {!isScrolling && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mt-6 text-center"
                        >
                            <p className={`text-2xl font-black leading-tight mb-4 uppercase tracking-tighter
                                ${isDark ? 'text-white' : 'text-slate-900'}
                            `}>
                                {t('contact.text')}
                            </p>

                            <div className="space-y-2">
                                <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span className="text-emerald-500 opacity-80 mr-2 font-mono">TG:</span>
                                    kah13x
                                </p>
                                <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span className="text-emerald-500 opacity-80 mr-2 font-mono">Mail:</span>
                                    vlad13holod@gmail.com
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Фоновое свечение (только в темной теме) */}
                {isDark && (
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                )}
            </motion.div>

            {/* ТЕКСТУРА ШУМА (Grain) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}>
            </div>
        </motion.div>
    );
};

export default Contact;