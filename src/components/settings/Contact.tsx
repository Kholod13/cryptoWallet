import { Handshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Contact = () => {
    const [isScrolling, setIsScrolling] = useState(false);

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
            animate={{
                borderRadius: isScrolling ? "50%" : "24px",
                scale: isScrolling ? 0.8 : 1.1,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
            }}
            whileHover={{
                rotate: 360,
                scale: 1.2,
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className='flex justify-center items-center text-sm text-center text-wrap text-white font-bold flex-col bg-gray-600 p-9 h-max w-max shadow-xl m-3'
        >
            <Handshake size={80} className={isScrolling ? "opacity-50" : "opacity-100"} />

            {!isScrolling && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                >
                    <p className='text-xl pb-3 leading-tight'>Contact with<br/>developer</p>
                    <p className="font-medium text-gray-300"><span className="text-emerald-400">Telegram:</span> kah13x</p>
                    <p className="font-medium text-gray-300"><span className="text-emerald-400">Email:</span> vlad13holod@gmail.com</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Contact;