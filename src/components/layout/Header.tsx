import {Search, Bell, Trophy, UserRoundIcon} from 'lucide-react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux"; //redux
import {type RootState, useAppSelector} from '../../store/';

export const Header = () => {

    const title = useSelector((state: RootState) => state.ui.pageTitle); // redux title
    const user = useAppSelector((state) => state.auth.user);

    // Если данных еще нет (грузятся), ставим пустые строки или скелетоны
    const username = user?.username || 'Loading...';
    const profession = user?.profession || 'User';
    const tempAvatar = user?.avatarUrl || '';

    return (
        <header className="flex px-6 py-4 justify-between items-center bg-gray-200">
            {/* Title */}
            <p className="text-slate-600 font-bold text-2xl w-1/8">{title}</p>
            {/* Input */}
            <div className="flex bg-gray-300 p-4 gap-5 rounded-xl w-1/3">
                <Search />
                <input type="text" placeholder="Search here"
                className="border-none outline-none focus:ring-0 text-gray-600 w-full"/>
            </div>
            {/* Message buttons */}
            <div className="flex items-center gap-5">
                <button className="border-2 p-3 rounded-xl border-[#362F5E] hover:bg-gray-300
                active:border:bg-[#362F5E] transition-all duration-300">
                    <Bell />
                </button>
                <button className="border-2 p-3 rounded-xl border-[#362F5E] hover:bg-gray-300
                active:border:bg-[#362F5E] transition-all duration-300">
                    <Trophy />
                </button>
            </div>
            {/* Profile info */}
            <div className="flex items-center gap-5 px-5 h-full">
                <Link to="/settings" className="cursor-pointer">
                    <div className="relative group flex items-center justify-center w-20 h-20 bg-gray-400 rounded-3xl overflow-hidden border-4 border-slate-600 shadow-xl">
                        {tempAvatar ? (
                            <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserRoundIcon size={50} className="text-slate-300" />
                        )}
                    </div>
                </Link>
                <div className="py-8p">
                    <p className="font-bold text-xl">{username}</p>
                    <p className="text-gray-500 text-sm flex justify-center">{profession}</p>
                </div>
            </div>
        </header>
    )
}

export default Header;