import { motion } from 'framer-motion';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className} overflow-hidden rounded-[50%]`}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* 1. ВНЕШНИЙ КОНТУР (Статичный порт) */}
                <circle cx="50" cy="50" r="44" stroke="#362F5E" strokeWidth="2" strokeDasharray="4 6" />

                {/* 2. ТРИ СЛУЖЕБНЫХ КОЛЬЦА (Вращаются идеально по центру) */}
                {[...Array(3)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="35" // Тот же радиус для всех для идеального наложения
                        stroke={i === 0 ? "#10B981" : i === 1 ? "gray" : "#362F5E"}
                        strokeWidth="14"
                        strokeLinecap="round"
                        // ИСПОЛЬЗУЕМ 0.5 ДЛЯ ЦЕНТРИРОВАНИЯ ОПОРНОЙ ТОЧКИ
                        style={{ originX: 0.5, originY: 0.5 }}
                        animate={{
                            // Разные направления вращения для технологичности
                            rotate: i % 2 === 0 ? [0, 360] : [0, -360],
                            // Дуги "дышат", меняя длину
                            strokeDasharray: ["20, 200", "70, 200", "20, 200"],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "linear" // Линейное вращение без пауз
                        }}
                    />
                ))}

                {/* 3. ЦЕНТРАЛЬНОЕ ЯДРО (Вращающийся Кристалл) */}
                <motion.rect
                    x="35" y="35" width="30" height="30"
                    rx="6"
                    fill="#362F5E"
                    animate={{
                        rotate: [45, 135, 225, 315, 405],
                        scale: [1, 0.8, 1.2, 1],
                        borderRadius: ["20%", "50%", "20%"] // Морфинг формы
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* 4. СВЕТОВОЙ БЛИК В ЦЕНТРЕ */}
                <motion.circle
                    cx="50" cy="50" r="4"
                    fill="white"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </svg>

            {/* Дополнительное внешнее свечение через CSS */}
            <div className="absolute inset-0 bg-[#10B981] rounded-full blur-2xl opacity-10 animate-pulse" />
        </div>
    );
};

export default Logo;