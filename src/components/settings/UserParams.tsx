import React, { useState, useRef, useEffect } from 'react';
import { UserRoundIcon, Check, Camera } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToast } from '../../store/slices/toastSlice';
import { resetStatus, updateProfile } from "../../store/slices/authSlice";
import {useTranslation} from "react-i18next";

export const UserParams = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    // Получаем тему и данные пользователя
    const { theme } = useAppSelector((state) => state.ui);
    const user = useAppSelector((state) => state.auth.user);
    const { isLoading } = useAppSelector((state) => state.auth);

    const [name, setName] = useState(user?.username || '');
    const [profession, setProfession] = useState(user?.profession || '');
    const [tempAvatar, setTempAvatar] = useState(user?.avatarUrl || '');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(user.username);
            setProfession(user.profession || '');
            setTempAvatar(user.avatarUrl || '');
        }
    }, [user]);

    useEffect(() => {
        return () => { dispatch(resetStatus()); };
    }, [dispatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                dispatch(addToast({ message: 'Image is too large (max 2MB)', type: 'error' }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => { setTempAvatar(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const resultAction = await dispatch(updateProfile({
            username: name,
            profession: profession,
            avatarUrl: tempAvatar
        }));

        if (updateProfile.fulfilled.match(resultAction)) {
            dispatch(addToast({ message: 'Profile updated!', type: 'success' }));
        }
    };

    // Стили зависящие от темы
    const isDark = theme === 'dark';

    return (
        <div className={`relative p-[1px] rounded-[32px] overflow-hidden transition-all duration-500 shadow-2xl
            ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-slate-200 to-slate-100'}
        `}>
            {/* ГЛАВНЫЙ КОНТЕЙНЕР СТЕКЛА */}
            <div className={`relative z-10 p-6 md:p-8 rounded-[31px] backdrop-blur-[20px] flex flex-col gap-8 transition-colors duration-500
                ${isDark ? 'bg-[#0D0F14]/90' : 'bg-white/80'}
            `}>

                {/* ХЕДЕР БЛОКА */}
                <div className="flex justify-between items-center border-b pb-6 transition-colors duration-500
                    ${isDark ? 'border-white/5' : 'border-slate-200'}"
                >
                    <div>
                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {t('profile.title')}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                            {t('profile.undertitle')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

                    {/* AVATAR SECTION */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-[40px] overflow-hidden border-4 flex items-center justify-center transition-all duration-500 shadow-xl
                                ${isDark ? 'bg-white/5 border-white/10 group-hover:border-emerald-500/50' : 'bg-slate-100 border-white group-hover:border-blue-500/50'}
                            `}>
                                {tempAvatar ? (
                                    <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <UserRoundIcon size={48} className={isDark ? 'text-slate-700' : 'text-slate-300'} />
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                            >
                                <Camera size={20} />
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>

                    {/* INPUTS SECTION */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* USERNAME */}
                        <div className="flex flex-col gap-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('profile.name')}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full p-4 rounded-2xl outline-none border-2 transition-all font-bold
                                    ${isDark
                                    ? 'bg-white/5 border-transparent focus:border-[#362F5E] text-white'
                                    : 'bg-slate-50 border-slate-100 focus:border-[#362F5E] text-slate-900'}
                                `}
                            />
                        </div>

                        {/* PROFESSION */}
                        <div className="flex flex-col gap-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('profile.role')}
                            </label>
                            <input
                                type="text"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                className={`w-full p-4 rounded-2xl outline-none border-2 transition-all font-bold
                                    ${isDark
                                    ? 'bg-white/5 border-transparent focus:border-[#362F5E] text-white'
                                    : 'bg-slate-50 border-slate-100 focus:border-[#362F5E] text-slate-900'}
                                `}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`flex items-center gap-2 font-black py-3 px-8 rounded-2xl transition-all active:scale-95 cursor-pointer disabled:opacity-50 shadow-lg
                                        ${isDark
                        ? 'bg-[#362F5E] text-white hover:bg-[#433a73] shadow-purple-900/20'
                        : 'bg-[#362F5E] text-white hover:bg-slate-800 shadow-slate-300'}
                                    `}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : <Check size={20} />}
                    {t('profile.button')}
                </button>
        </div>

    {/* ТЕКСТУРА ШУМА (только для темной темы) */}
    {isDark && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}>
        </div>
    )}
</div>
);
};

export default UserParams;