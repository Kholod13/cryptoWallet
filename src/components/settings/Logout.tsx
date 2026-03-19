import { useState } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from '../../store/slices/authSlice';
import { ConfirmModal } from '../ui/ConfirmModal';
import { motion } from 'framer-motion';
import {useTranslation} from "react-i18next";

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
                // ГРАДИЕНТНАЯ РАМКА (p-[1px])
                className={`relative inline-block text-center rounded-[32px] cursor-pointer overflow-hidden p-[1px] transition-all duration-500 shadow-xl group
                    ${isDark
                    ? 'bg-gradient-to-br from-white/10 to-transparent shadow-purple-900/10'
                    : 'bg-gradient-to-br from-slate-200 to-slate-300 shadow-slate-200'}
                `}
            >
                {/* ВНУТРЕННИЙ КОНТЕЙНЕР (Стекло) */}
                <div className={`flex h-full flex-col items-center justify-center p-9 rounded-[31px] backdrop-blur-xl transition-colors duration-500
                    ${isDark
                    ? 'bg-[#362F5E]/80 group-hover:bg-[#433a73]'
                    : 'bg-white/80 group-hover:bg-white'}
                `}>

                    <div className={`mb-4 p-4 rounded-2xl transition-all duration-500
                        ${isDark ? 'bg-white/5 text-white' : 'bg-[#362F5E]/5 text-[#362F5E]'}
                    `}>
                        <SquareArrowOutUpRight size={64} strokeWidth={2.5} />
                    </div>

                    <p className={`text-xl font-black uppercase tracking-widest transition-colors duration-500
                        ${isDark ? 'text-white' : 'text-[#362F5E]'}
                    `}>
                        {t('logout')}
                    </p>

                    {/* Декоративный блик для темной темы */}
                    {isDark && (
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                    )}
                </div>
            </motion.div>

            {/* ВЫЗОВ УНИВЕРСАЛЬНОЙ МОДАЛКИ */}
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