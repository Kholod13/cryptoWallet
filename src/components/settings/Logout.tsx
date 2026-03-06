import { useState } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useAppDispatch } from "../../store";
import { logout } from '../../store/slices/authSlice';
import { ConfirmModal } from '../ui/ConfirmModal'; // Импортируем нашу модалку

export const Logout = () => {
    const dispatch = useAppDispatch();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Стейт для модалки

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            {/* Сама кнопка Logout теперь просто открывает модалку */}
            <div
                onClick={() => setIsConfirmOpen(true)}
                className='inline-block text-center h-max text-white font-bold rounded-xl cursor-pointer flex-col bg-[#362F5E] p-9 hover:bg-[#4a4080] transition-colors'
            >
                <SquareArrowOutUpRight color='white' size={80}/>
                <p>Logout</p>
            </div>

            {/* ВЫЗОВ УНИВЕРСАЛЬНОЙ МОДАЛКИ */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleLogout}
                title="Are you sure?"
                description="You will be logged out of your account. You will need to enter your credentials again to access your portfolio."
                confirmText="Yes, Logout"
                cancelText="Stay logged in"
                type="danger" // Делает кнопку красной
            />
        </>
    )
}

export default Logout;