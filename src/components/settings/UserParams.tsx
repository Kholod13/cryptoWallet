import React, { useState, useRef, useEffect } from 'react';
import { UserRoundIcon, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToast } from '../../store/slices/toastSlice';
import {resetStatus, updateProfile} from "../../store/slices/authSlice";

export const UserParams = () => {
    const dispatch = useAppDispatch();

    // 1. ИСПРАВЛЕНО: берем данные из auth.user (так как мы объединили слайсы)
    const user = useAppSelector((state) => state.auth.user);
    const { isLoading } = useAppSelector((state) => state.auth);

    const [name, setName] = useState(user?.username || '');
    const [profession, setProfession] = useState(user?.profession || '');
    const [tempAvatar, setTempAvatar] = useState(user?.avatarUrl || '');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. ДОБАВЛЕНО: Синхронизация полей, когда данные приходят с бэкенда
    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(user.username);
            setProfession(user.profession || '');
            setTempAvatar(user.avatarUrl || '');
        }
    }, [user]);
    useEffect(() => {
        // Эта функция сработает, когда пользователь уходит со страницы Settings
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                dispatch(addToast({ message: 'Image is too large (max 2MB)', type: 'error' }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        // 3. ИСПРАВЛЕНО: Диспатчим и ждем результата для тостера
        const resultAction = await dispatch(updateProfile({
            username: name,
            profession: profession,
            avatarUrl: tempAvatar
        }));

        // Проверяем, успешно ли прошел асинхронный экшен
        if (updateProfile.fulfilled.match(resultAction)) {
            dispatch(addToast({
                message: 'Profile updated in database!',
                type: 'success'
            }));
        } else {
            dispatch(addToast({
                message: 'Error updating profile',
                type: 'error'
            }));
        }
    };

    return (
        <div className="flex flex-col bg-gray-500 p-5 rounded-2xl gap-6 shadow-inner">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <p className="font-bold text-white text-xl tracking-tight">Personal Information</p>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 px-8 rounded-xl transition-all duration-200 active:scale-95 shadow-lg cursor-pointer disabled:opacity-50"
                >
                    <Check size={18} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Image Section */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group flex items-center justify-center w-28 h-28 bg-gray-400 rounded-3xl overflow-hidden border-4 border-slate-600 shadow-xl">
                        {tempAvatar ? (
                            <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserRoundIcon size={50} className="text-slate-300" />
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-blue-300 hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                        Change Photo
                    </button>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-bold opacity-70 ml-1">Username</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-400 rounded-xl border-2 border-transparent focus:border-[#362F5E] p-3 text-white outline-none transition-all shadow-md" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-bold opacity-70 ml-1">Profession</label>
                    <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="bg-gray-400 rounded-xl border-2 border-transparent focus:border-[#362F5E] p-3 text-white outline-none transition-all shadow-md" />
                </div>
            </div>
        </div>
    );
};

export default UserParams;