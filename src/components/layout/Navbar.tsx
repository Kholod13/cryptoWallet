import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, Settings } from 'lucide-react';
import codeBy from '../../assets/codeBy.png';
import {useDispatch} from "react-redux"; // redux
import {setPageTitle} from "../../store/slices/uiSlice.ts"; //redux
import Logo from '../ui/Logo.tsx';

// Pages list
const NAV_ITEMS = [
    {id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard},
    {id: 'wallets', label: 'Wallets', path: '/wallets', icon: Wallet},
    {id: 'transactions', label: 'Transactions', path: 'transactions', icon: History},
    {id: 'settings', label: 'Settings', path: 'settings', icon: Settings},
];

export const Navbar = () => {

    const dispatch = useDispatch();

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
            <div className="flex flex-col items-center gap-8 px-2 ml-2 mr-2 mt-5 mb-5 bg-gray-400
            p-6 rounded-xl">
                <img src={codeBy} alt="code_icon" className="w-40 h-40" />
                <p className="font-bold text-wrap text-sm text-gray-600 text-center">© 2026 Code by Vladyslav Kh.</p>
            </div>

        </nav>
    )
}

export default Navbar;