import { motion } from 'framer-motion';

export const AnimatedBackgroundText = () => {
    const text = "Your Crypto Tracker";

    // Разделяем текст на буквы для анимации каждой по отдельности
    const letters = Array.from(text);

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
        }),
    };

    return (
        <div className="absolute top-[10%] left-0 w-full flex flex-col items-center pointer-events-none select-none z-0">
            {/* Декоративное свечение на фоне */}
            <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/5 right-1/4 w-[300px] h-[100px] bg-emerald-500/5 rounded-full blur-[100px]" />

            <motion.h1
                variants={container}
                initial="hidden"
                animate="visible"
                className="text-[12vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none text-center px-4"
            >
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        className="inline-block"
                        style={{
                            // Применяем эффект градиента и свечения
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                            backgroundImage: 'linear-gradient(to bottom, #fff, #362F5E)',
                            WebkitBackgroundClip: 'text',
                            textShadow: '0 0 30px rgba(58, 134, 255, 0.2)'
                        }}
                        animate={{
                            opacity: [0.1, 0.3, 0.15], // Текст будет слегка мерцать
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}

                {/* Мигающий курсор */}
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity
                    }}
                    className="inline-block w-[1vw] h-[4vw] bg-emerald-400 ml-2 mt-2 shadow-[0_0_20px_#10b981]"
                />
            </motion.h1>

            {/* Дополнительная надпись помельче */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-4 text-center text-slate-600 font-mono text-[8px] md:text-xs tracking-[0.5em] uppercase"
                style={{color: 'white'}}
            >
                Decentralized & Secure
            </motion.p>
        </div>
    );
};