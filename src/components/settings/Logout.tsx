import { useState } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from '../../store/slices/authSlice';
import { ConfirmModal } from '../ui/ConfirmModal';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

export const Logout = () => {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector(state => state.ui);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isDark = theme === 'dark';
    const { t } = useTranslation();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsConfirmOpen(true)}
                /*
                   АДАПТАЦИЯ:
                   w-full на мобилках, w-max на десктопе.
                   Уменьшили скругление до 24px на маленьких экранах.
                */
                className={`relative inline-block text-center rounded-[24px] md:rounded-[32px] cursor-pointer overflow-hidden p-[1px] transition-all duration-500 shadow-xl group w-full sm:w-max
                    ${isDark
                    ? 'bg-gradient-to-br from-white/10 to-transparent shadow-purple-900/10'
                    : 'bg-gradient-to-br from-slate-200 to-slate-300 shadow-slate-200'}
                `}
            >
                {/* ВНУТРЕННИЙ КОНТЕЙНЕР (Стекло) */}
                <div className={`flex h-full flex-col items-center justify-center 
                    p-6 md:p-9 rounded-[23px] md:rounded-[31px] backdrop-blur-xl transition-colors duration-500
                    ${isDark
                    ? 'bg-[#362F5E]/80 group-hover:bg-[#433a73]'
                    : 'bg-white/80 group-hover:bg-white'}
                `}>

                    {/* ИКОНКА: 48 на мобилках, 64 на десктопе */}
                    <div className={`mb-3 md:mb-4 p-3 md:p-4 rounded-xl transition-all duration-500
                        ${isDark ? 'bg-white/5 text-white' : 'bg-[#362F5E]/5 text-[#362F5E]'}
                    `}>
                        <SquareArrowOutUpRight className="w-10 h-10 md:w-16 md:h-16" strokeWidth={2.5} />
                    </div>

                    {/* ТЕКСТ: text-lg на мобилках, text-xl на десктопе */}
                    <p className={`text-lg md:text-xl font-black uppercase tracking-widest transition-colors duration-500
                        ${isDark ? 'text-white' : 'text-[#362F5E]'}
                    `}>
                        {t('logout')}
                    </p>

                    {isDark && (
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                    )}
                </div>
            </motion.div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleLogout}
                title="Sign Out"
                description="Are you sure you want to exit? Your session will be terminated and you'll need to log in again."
                confirmText="Yes, Logout"
                cancelText="Stay"
                type="danger"
            />
        </>
    );
};

export default Logout;