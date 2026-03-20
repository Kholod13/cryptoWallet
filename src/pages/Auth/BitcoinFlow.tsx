import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Тип для отдельной "летящей" транзакции
interface TransactionPip {
    id: number;
    delay: number;
    duration: number;
    y: number; // Высота полета
}

export const BitcoinFlow = () => {
    const [transactions, setTransactions] = useState<TransactionPip[]>([]);

    // Генерируем "поток" транзакций
    useEffect(() => {
        const interval = setInterval(() => {
            const newTx: TransactionPip = {
                id: Date.now(),
                delay: 0,
                duration: 2 + Math.random() * 2, // Разная скорость
                y: Math.random() * 100 - 50, // Разброс по вертикали
            };

            setTransactions(prev => [...prev.slice(-15), newTx]); // Держим максимум 15 в памяти
        }, 800); // Новая транзакция каждые 0.8 сек

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="absolute bottom-0 w-full h-[150px] md:h-1/4 overflow-hidden flex items-center justify-center">

            {/* ЦЕНТРАЛЬНАЯ АНИМАЦИЯ ПОТОКА */}
            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence>
                    {transactions.map((tx) => (
                        <motion.div
                            key={tx.id}
                            initial={{ x: '-500%', y: tx.y, opacity: 0, scale: 0 }}
                            animate={{
                                x: '500%',
                                opacity: [0, 1, 1, 0], // Появляется, летит, исчезает
                                scale: [0, 1.2, 1, 0.5]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: tx.duration,
                                ease: "linear"
                            }}
                            className="absolute"
                        >
                            {/* Хвост кометы */}
                            <div className="relative">
                                <div className="w-25 h-[2px] bg-gradient-to-r from-transparent to-orange-400 rounded-full" />
                                {/* Голова кометы (частица) */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fb923c]" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Статичные линии связи */}
            </div>

            {/* НИЖНЯЯ ИНФО-ПАНЕЛЬ */}
            <div className="absolute bottom-6 right-6 px-6 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm flex gap-4" style={{color: 'white'}}>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Network Live</span>
                </div>
                <div className="w-[1px] h-3 bg-white/10" />
                {/* eslint-disable-next-line react-hooks/purity */}
                <span className="text-[10px] text-slate-300 font-mono">TPS: {(1.5 + Math.random()).toFixed(1)}</span>
            </div>
        </div>
    );
};

export default BitcoinFlow;