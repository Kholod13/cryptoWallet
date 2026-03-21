import { Handshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store';
import { useTranslation } from "react-i18next";

export const Contact = () => {
    const { theme } = useAppSelector(state => state.ui);
    const isDark = theme === 'dark';
    const { t } = useTranslation();

    return (
        <motion.div
            // Легкое появление при загрузке страницы
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // Небольшой отклик при нажатии/наведении
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-[1px] shadow-2xl m-2 md:m-4 rounded-[32px] overflow-hidden w-full max-w-[340px] md:max-w-md
                ${isDark
                ? 'bg-gradient-to-br from-white/20 to-transparent'
                : 'bg-gradient-to-br from-slate-200 to-slate-400'}
            `}
        >
            {/* ВНУТРЕННИЙ КОНТЕЙНЕР (Стекло) */}
            <div
                className={`relative z-10 flex flex-col items-center justify-center 
                    p-8 md:p-10 backdrop-blur-[20px] rounded-[31px]
                    ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
                `}
            >
                {/* ИКОНКА */}
                <div className={`mb-6 ${isDark ? 'text-emerald-400' : 'text-[#362F5E]'}`}>
                    <Handshake size={64} strokeWidth={1.5} />
                </div>

                {/* КОНТЕНТ (Всегда виден и стабилен) */}
                <div className="text-center">
                    <p className={`text-xl md:text-2xl font-black leading-tight mb-4 uppercase tracking-tighter
                        ${isDark ? 'text-white' : 'text-slate-900'}
                    `}>
                        {t('contact.text')}
                    </p>

                    <div className="space-y-3 mt-4">
                        <div className={`flex items-center justify-center gap-2 text-sm md:text-base font-bold 
                            ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <span className="text-emerald-500 font-mono">TG:</span>
                            <a href="https://t.me/kah13x" target="_blank" rel="noreferrer" className="hover:underline">
                                kah13x
                            </a>
                        </div>
                        <div className={`flex flex-col items-center gap-1 text-sm md:text-base font-bold 
                            ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <span className="text-emerald-500 font-mono text-xs uppercase">Mail:</span>
                            <a href="mailto:vlad13holod@gmail.com" className="hover:underline break-all">
                                vlad13holod@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Декоративное свечение */}
                {isDark && (
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                )}
            </div>

            {/* ТЕКСТУРА ШУМА */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}>
            </div>
        </motion.div>
    );
};

export default Contact;