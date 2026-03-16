import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Code2, X } from 'lucide-react';
import { useAppSelector } from '../../store';

export const ApiNotice = () => {
    const { theme } = useAppSelector(state => state.ui);
    const [isVisible, setIsVisible] = useState(true);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full p-[1px] rounded-[32px] overflow-hidden bg-gradient-to-r from-amber-500/40 via-transparent to-blue-500/40 shadow-xl"
                >
                    {/* ГЛАВНЫЙ КОНТЕЙНЕР СТЕКЛА */}
                    <div className={`
                        relative z-10 p-6 md:p-8 rounded-[31px] backdrop-blur-[24px] flex flex-col md:flex-row items-center gap-6
                        ${theme === 'dark' ? 'bg-[#0D0F14]/80' : 'bg-white/70'}
                    `}>

                        {/* КНОПКА ЗАКРЫТЬ (ВЕРХНИЙ ПРАВЫЙ УГОЛ) */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-all cursor-pointer hover:rotate-90
                                ${theme === 'dark' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-black/5'}
                            `}
                        >
                            <X size={18} />
                        </button>

                        {/* ИКОНКА С ЭФФЕКТОМ СВЕЧЕНИЯ */}
                        <div className="relative shrink-0">
                            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                <ShieldAlert size={32} />
                            </div>
                            <div className="absolute inset-0 bg-amber-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                        </div>

                        {/* ТЕКСТОВАЯ ЧАСТЬ */}
                        <div className="flex-1 text-center md:text-left pr-4">
                            <h4 className={`text-lg font-black tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Web3 Simulation Active
                            </h4>
                            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Currently, <span className="font-bold text-blue-500">MetaMask</span> and <span className="font-bold text-blue-500">Trust Wallet</span> connections use
                                simulated datasets to manage commercial API costs.
                                <span className="block mt-2 italic opacity-80">
                                    Note: The underlying source code includes a production-ready implementation for Moralis and Etherscan V2.
                                    Check the repository for API logic.
                                </span>
                            </p>
                        </div>

                        {/* ТЕХНИЧЕСКИЙ ТЕГ */}
                        <div className="shrink-0">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest
                                ${theme === 'dark' ? 'border-white/10 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}
                            `}>
                                <Code2 size={14} />
                                API logic inside
                            </div>
                        </div>
                    </div>

                    {/* ТЕКСТУРА ШУМА */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ApiNotice;