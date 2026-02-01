import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, Settings } from 'lucide-react';
import logo from '../../assets/logo.svg';
import codeBy from '../../assets/codeBy.png';

// Pages list
const NAV_ITEMS = [
    {id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard},
    {id: 'wallets', label: 'Wallets', path: '/wallets', icon: Wallet},
    {id: 'transactions', label: 'Transactions', path: 'transactions', icon: History},
    {id: 'settings', label: 'Settings', path: 'settings', icon: Settings},
];

export const Navbar = () => {
    return (
        <nav className="flex flex-col p-4 h-screen">
            {/* Flex block for (h-screen/flex-1) */}
            <div className="flex flex-col flex-1">
                {/* Logotype */}
                <div className="flex items-center gap-3 px-2 ml-2 mr-2 mt-2 mb-5">
                    <img src={logo} alt="Logo" className="w-14 h-14" />
                    <span className="font-bold text-2xl">CryptoWallet</span>
                </div>
                {/* List of pages array */}
                <ul className=" flex flex-col gap-3 flex-auto">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
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
            <div className="flex flex-col items-center gap-8 px-2 ml-2 mr-2 mt-2 mb-5 bg-gray-400
            p-6 rounded-xl">
                <img src={codeBy} alt="code_icon" className="w-40 h-40" />
                <p className="font-bold text-wrap text-sm text-gray-600 text-center">© 2026 Code by Vladyslav K.</p>
            </div>

        </nav>
    )
}

export default Navbar;