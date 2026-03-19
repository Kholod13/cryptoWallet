import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, Settings } from 'lucide-react';
import codeBy from '../../assets/codeBy.png';
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/slices/uiSlice.ts";
import Logo from '../ui/Logo.tsx';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store';
import { useTranslation } from 'react-i18next'; // 1. Импортируем хук

// 2. В массиве теперь храним ключи (например, 'common.dashboard')
const NAV_ITEMS = [
    {id: 'dashboard', labelKey: 'common.dashboard', path: '/dashboard', icon: LayoutDashboard},
    {id: 'wallets', labelKey: 'common.wallets', path: '/wallets', icon: Wallet},
    {id: 'transactions', labelKey: 'common.transactions', path: '/transactions', icon: History},
    {id: 'settings', labelKey: 'common.settings', path: '/settings', icon: Settings},
];

export const Navbar = () => {
    const { t } = useTranslation(); // 3. Инициализируем перевод
    const dispatch = useDispatch();

    const { theme } = useAppSelector(state => state.ui);
    const isDark = theme === 'dark';

    return (
        <nav className="flex flex-col p-4 overflow-hidden">
            <div className="flex flex-col flex-1">
                {/* Logotype - заголовок тоже переводим при клике */}
                <NavLink
                    className="flex items-center gap-2 px-2 mb-10 mt-6"
                    to={'/dashboard'}
                    onClick={() => dispatch(setPageTitle(t('common.dashboard')))}
                >
                    <Logo className="w-10 h-10" />
                    <h1 className="text-[#362f5e] text-2xl font-black tracking-tighter leading-none">
                        SYNC<span className="text-emerald-400">SPACE</span>
                    </h1>
                </NavLink>

                {/* List of pages */}
                <ul className="flex flex-col gap-3 flex-auto">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
                                // 4. Диспатчим переведенное название в заголовок страницы
                                onClick={() => dispatch(setPageTitle(t(item.labelKey)))}
                                className={({ isActive }) => `
                                    flex font-bold items-center gap-3 px-5 py-6 rounded-lg transition-all duration-800
                                    ${isActive ? 'bg-[#362F5E] text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:transition-all duration-600'}
                                `}
                            >
                                <item.icon size={24} />
                                {/* 5. Отображаем переведенный текст */}
                                <span>{t(item.labelKey)}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer block */}
            <motion.div
                whileHover={{ y: -5 }}
                className={`relative mx-4 mt-auto mb-6 p-[1px] rounded-[32px] overflow-hidden transition-all duration-500
                    ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent shadow-2xl' : 'bg-gradient-to-br from-slate-200 to-white shadow-lg'}
                `}
            >
                <div className={`relative z-10 flex flex-col items-center gap-6 p-6 rounded-[31px] backdrop-blur-xl transition-colors duration-500
                    ${isDark ? 'bg-[#161B26]/80' : 'bg-white/60'}
                `}>
                    <div className="relative group">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40
                            ${isDark ? 'bg-blue-500' : 'bg-[#362F5E]'}
                        `} />
                        <img src={codeBy} alt="code_icon" className="relative z-10 w-28 h-28 object-contain transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="text-center space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-50
                            ${isDark ? 'text-slate-400' : 'text-slate-500'}
                        `}>
                            {/* 6. Переводим "Developed by" */}
                            {t('navbar.developed_by')}
                        </p>
                        <p className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>
                            Vladyslav Kholod
                        </p>
                        <div className={`h-[2px] w-8 mx-auto rounded-full mt-2 ${isDark ? 'bg-blue-500/50' : 'bg-[#362F5E]/20'}`} />
                    </div>

                    {isDark && (
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                    )}
                </div>

                <p className={`absolute bottom-3 w-full text-center text-[9px] font-bold opacity-30 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {/* 7. Переводим "Rights Reserved" */}
                    © 2026 {t('navbar.rights_reserved')}
                </p>
            </motion.div>
        </nav>
    )
}

export default Navbar;