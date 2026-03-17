import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, Settings } from 'lucide-react';
import codeBy from '../../assets/codeBy.png';
import {useDispatch} from "react-redux"; // redux
import {setPageTitle} from "../../store/slices/uiSlice.ts"; //redux
import Logo from '../ui/Logo.tsx';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store';

// Pages list
const NAV_ITEMS = [
    {id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard},
    {id: 'wallets', label: 'Wallets', path: '/wallets', icon: Wallet},
    {id: 'transactions', label: 'Transactions', path: 'transactions', icon: History},
    {id: 'settings', label: 'Settings', path: 'settings', icon: Settings},
];

export const Navbar = () => {

    const dispatch = useDispatch();

    const { theme } = useAppSelector(state => state.ui);
    const isDark = theme === 'dark';

    return (
        <nav className="flex flex-col p-4 overflow-hidden">
            {/* Flex block for (h-screen/flex-1) */}
            <div className="flex flex-col flex-1">
                {/* Logotype */}
                <NavLink className="flex items-center gap-2 px-2 mb-10 mt-6" to={'/dashboard'} onClick={() => dispatch(setPageTitle('Dashboard'))}>
                    <Logo className="w-10 h-10" />
                    <h1 className="text-[#362f5e] text-2xl font-black tracking-tighter leading-none">
                        SYNC<span className="text-emerald-400">SPACE</span>
                    </h1>
                </NavLink>
                {/* List of pages array */}
                <ul className=" flex flex-col gap-3 flex-auto">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
                                onClick={() => dispatch(setPageTitle(item.label))}
                                className={({ isActive }) => `
                                    flex font-bold items-center gap-3 px-5 py-6 rounded-lg transition-all duration-800
                                    ${isActive ? 'bg-[#362F5E] text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:transition-all duration-600'}
                                `}
                            >
                                <item.icon size={24} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

            </div>
            {/* Footer of navigation / text: no copyrighted */}
            <motion.div
                whileHover={{ y: -5 }} // Легкое приподнятие при наведении
                className={`
            relative mx-4 mt-auto mb-6 p-[1px] rounded-[32px] overflow-hidden transition-all duration-500
            ${isDark
                    ? 'bg-gradient-to-br from-white/10 to-transparent shadow-2xl'
                    : 'bg-gradient-to-br from-slate-200 to-white shadow-lg'}
        `}
            >
                {/* ВНУТРЕННИЙ КОНТЕЙНЕР (Стекло) */}
                <div className={`
            relative z-10 flex flex-col items-center gap-6 p-6 rounded-[31px] backdrop-blur-xl transition-colors duration-500
            ${isDark ? 'bg-[#161B26]/80' : 'bg-white/60'}
        `}>

                    {/* ИЛЛЮСТРАЦИЯ / ИКОНКА */}
                    <div className="relative group">
                        {/* Мягкое свечение за иконкой */}
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40
                    ${isDark ? 'bg-blue-500' : 'bg-[#362F5E]'}
                `} />

                        <img
                            src={codeBy}
                            alt="code_icon"
                            className="relative z-10 w-28 h-28 object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>

                    {/* ТЕКСТ КОПИРАЙТА */}
                    <div className="text-center space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-50
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}
                `}>
                            Developed by
                        </p>
                        <p className={`text-sm font-black tracking-tight
                    ${isDark ? 'text-white' : 'text-[#362F5E]'}
                `}>
                            Vladyslav Kholod
                        </p>
                        <div className={`h-[2px] w-8 mx-auto rounded-full mt-2
                    ${isDark ? 'bg-blue-500/50' : 'bg-[#362F5E]/20'}
                `} />
                    </div>

                    {/* ТЕКСТУРА ШУМА (только для темной темы) */}
                    {isDark && (
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                    )}
                </div>

                {/* Копирайт год */}
                <p className={`absolute bottom-3 w-full text-center text-[9px] font-bold opacity-30
            ${isDark ? 'text-white' : 'text-slate-900'}
        `}>
                    © 2026 All Rights Reserved
                </p>
            </motion.div>

        </nav>
    )
}

export default Navbar;