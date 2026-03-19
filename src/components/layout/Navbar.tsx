import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, Settings } from 'lucide-react';
import codeBy from '../../assets/codeBy.png';
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/slices/uiSlice.ts";
import Logo from '../ui/Logo.tsx';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
    {id: 'dashboard', labelKey: 'common.dashboard', path: '/dashboard', icon: LayoutDashboard},
    {id: 'wallets', labelKey: 'common.wallets', path: '/wallets', icon: Wallet},
    {id: 'transactions', labelKey: 'common.transactions', path: '/transactions', icon: History},
    {id: 'settings', labelKey: 'common.settings', path: '/settings', icon: Settings},
];

export const Navbar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { theme } = useAppSelector(state => state.ui);
    const isDark = theme === 'dark';

    return (
        <nav className={`
            /* Мобилка: фиксированная панель внизу */
            fixed bottom-0 left-0 w-full h-20 flex flex-row border-t z-[1000]
            
            /* Десктоп: боковая панель */
            lg:sticky lg:top-0 lg:left-0 lg:w-72 lg:h-screen lg:flex-col lg:border-r lg:border-t-0
            
            backdrop-blur-xl transition-all duration-500
            ${isDark
            ? 'bg-[#0D0F14]/80 border-white/5'
            : 'bg-white/80 border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]'}
        `}>

            <div className="flex flex-row lg:flex-col flex-1 w-full lg:p-4">

                {/* Логотип: скрываем на мобилках, так как он есть в Хедере */}
                <NavLink
                    className="hidden lg:flex items-center gap-3 px-4 mb-10 mt-6 group"
                    to={'/dashboard'}
                    onClick={() => dispatch(setPageTitle('common.dashboard'))}
                >
                    <Logo className="w-10 h-10 transition-transform group-hover:rotate-12" />
                    <h1 className={`text-2xl font-black tracking-tighter leading-none transition-colors ${isDark ? 'text-white' : 'text-[#362f5e]'}`}>
                        SYNC<span className="text-emerald-400">SPACE</span>
                    </h1>
                </NavLink>

                {/* Список страниц */}
                <ul className="flex flex-row lg:flex-col justify-around lg:justify-start items-center w-full px-2 lg:px-0 lg:gap-3">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id} className="flex-1 lg:w-full lg:flex-none">
                            <NavLink
                                to={item.path}
                                // Передаем КЛЮЧ в Redux для динамического перевода в хедере
                                onClick={() => dispatch(setPageTitle(item.labelKey))}
                                className={({ isActive }) => `
                                    flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 
                                    py-3 lg:px-5 lg:py-5 rounded-2xl transition-all duration-300
                                    ${isActive
                                    ? (isDark ? 'text-blue-400 lg:bg-[#362F5E] lg:text-white lg:shadow-lg lg:shadow-blue-900/20' : 'text-[#362F5E] lg:bg-[#362F5E] lg:text-white')
                                    : (isDark ? 'text-slate-500 hover:text-slate-300 lg:hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 lg:hover:bg-black/5')}
                                `}
                            >
                                <item.icon size={window.innerWidth < 1024 ? 22 : 24} />
                                <span className="text-[10px] lg:text-sm font-black uppercase tracking-widest lg:tracking-normal lg:capitalize">
                                    {t(item.labelKey)}
                                </span>

                                {/* Индикатор активной страницы для мобилок (точка снизу) */}
                                <div className={`lg:hidden w-1 h-1 rounded-full mt-0.5 transition-all ${isDark ? 'bg-blue-400' : 'bg-[#362F5E]'} opacity-0`} />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer (Code by): Скрываем на мобилках, чтобы не занимать место */}
            <motion.div
                whileHover={{ y: -5 }}
                className={`hidden lg:block relative mx-6 mt-auto mb-8 p-[1px] rounded-[32px] overflow-hidden transition-all duration-500
                    ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-slate-200 to-white'}
                `}
            >
                <div className={`relative z-10 flex flex-col items-center gap-6 p-6 rounded-[31px] backdrop-blur-xl
                    ${isDark ? 'bg-[#161B26]/80' : 'bg-white/60'}
                `}>
                    <div className="relative group">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${isDark ? 'bg-blue-500' : 'bg-[#362F5E]'}`} />
                        <img src={codeBy} alt="code_icon" className="relative z-10 w-24 h-24 object-contain" />
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Developed by</p>
                        <p className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-[#362F5E]'}`}>Vladyslav Kholod</p>
                    </div>
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;