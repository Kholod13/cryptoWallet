import { motion } from 'framer-motion';
import { Layers, Wallet, Landmark, LayoutGrid, Smartphone, Share2 } from 'lucide-react';

// Список логотипов/иконок для орбиты
const PLATFORMS = [
    { id: 1, icon: Wallet, color: '#F3BA2F', label: 'MetaMask' },    // Binance Yellow
    { id: 2, icon: Landmark, color: '#0052FF', label: 'Coinbase' }, // Blue
    { id: 3, icon: LayoutGrid, color: '#FFFFFF', label: 'OKX' },     // White
    { id: 4, icon: Smartphone, color: '#3375BB', label: 'Trust' },   // Trust Blue
    { id: 5, icon: Share2, color: '#627EEA', label: 'WalletConnect' } // ETH Blue
];

export const DataAggregation = () => {
    const radius = 120; // Радиус круга в пикселях

    return (
        <div className="absolute top-[20%] left-[10%] scale-50 md:scale-75 lg:scale-100 flex items-center justify-center w-[400px] h-[400px]">

            {/* 1. ЦЕНТРАЛЬНАЯ ИКОНКА (Символ объединения) */}
            <div className="relative z-20 bg-[#362F5E] p-6 rounded-full shadow-[0_0_50px_rgba(54,47,94,0.5)] border border-white/20">
                <Layers size={48} className="text-emerald-400 animate-pulse" />
            </div>

            {/* 2. ОРБИТА (Вращающийся контейнер) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-10"
            >
                {PLATFORMS.map((platform, index) => {
                    // Распределяем иконки равномерно по кругу
                    const angle = (index / PLATFORMS.length) * (2 * Math.PI);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <motion.div
                            key={platform.id}
                            className="absolute left-1/2 top-1/2 flex items-center justify-center"
                            style={{
                                x: x,
                                y: y,
                                marginLeft: -24, // Половина ширины иконки для центрирования
                                marginTop: -24,
                            }}
                        >
                            {/* Контейнер самой иконки */}
                            <motion.div
                                // МАГИЯ: вращаем иконку в обратную сторону, чтобы она всегда стояла прямо
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="bg-slate-800 border border-white/10 p-3 rounded-2xl shadow-xl backdrop-blur-md"
                            >
                                <platform.icon
                                    size={24}
                                    style={{ color: platform.color }}
                                />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* 3. ДЕКОРАТИВНЫЕ КОЛЬЦА */}
            <div className="absolute border border-white/5 rounded-full w-[240px] h-[240px] z-0" />
            <div className="absolute border border-white/5 rounded-full w-[320px] h-[320px] z-0" />
        </div>
    );
};

export default DataAggregation;