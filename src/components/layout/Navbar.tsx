import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, Settings } from 'lucide-react';
import logo from '../../assets/logo.svg';

const NAV_ITEMS = [
    {id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard},
    {id: 'wallets', label: 'Wallets', path: '/wallets', icon: Wallet},
    {id: 'transactions', label: 'Transactions', path: 'transactions', icon: History},
    {id: 'settings', label: 'Settings', path: 'settings', icon: Settings},
];

export const Navbar = () => {
    return (
        <nav>
            <div className="flex items-center gap-3 px-2 mb-10">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <span className="text-white font-bold text-xl tracking-tight">CryptoPulse</span>
            </div>

            <ul>
                {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                            `}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div>
                <p>fofo</p>
            </div>
        </nav>
    )
}

export default Navbar;