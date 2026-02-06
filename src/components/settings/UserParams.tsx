import React, { useState, useRef } from 'react';
import { UserRoundIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store'; // Твои типизированные хуки
import { updateUser } from '../../store/slices/userSlice';

export const UserParams = () => {
    const dispatch = useAppDispatch();
    // Берем текущие данные из Redux для инициализации
    const userData = useAppSelector((state) => state.user);

    // Локальный стейт для формы
    const [name, setName] = useState(userData.username);
    const [profession, setProfession] = useState(userData.profession);
    const [tempAvatar, setTempAvatar] = useState(userData.avatarUrl);

    // Реф для скрытого инпута файла
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Функция для вызова выбора файла
    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    // Обработка выбора картинки
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            // Когда файл прочитан, превращаем его в строку и кладем в стейт
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setTempAvatar(base64String); // Теперь это длинный текст, который можно сохранить
            };

            reader.readAsDataURL(file);
        }
    };

    // Сохранение в Redux
    const handleSave = () => {
        dispatch(updateUser({
            username: name,
            profession: profession,
            avatarUrl: tempAvatar
        }));
        alert("Profile updated!");
    };

    return (
        <div className="flex flex-col bg-gray-500 p-3 rounded-xl gap-3">
            <div className="flex justify-between items-center">
                <p className="font-bold text-white text-xl">Set user information</p>

                <button
                    onClick={handleSave}
                    className="bg-emerald-400 hover:bg-emerald-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                >
                    Save
                </button>
            </div>
            <div className="flex justify-around  mb-4">
                {/* Image */}
                <div className="flex gap-5 items-center">
                    <div className="flex items-center justify-center w-25 h-25 bg-gray-400 rounded-xl overflow-hidden border-2 border-slate-700">
                        {tempAvatar ? (
                            <img src={tempAvatar} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserRoundIcon size={50} />
                        )}
                    </div>

                    {/* СКРЫТЫЙ ИНПУТ */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* КНОПКА ВМЕСТО ИНПУТА */}
                    <button
                        onClick={handleChooseFile}
                        className="bg-[#362F5E] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4a4080] transition-colors"
                    >
                        Choose file
                    </button>
                </div>

                {/* Username */}
                <div>
                    <p className="font-bold text-white text-lg px-1 pt-1">Username</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Username"
                        className='bg-gray-400 rounded-xl border-[#362F5E] p-2 hover:outline-2 outline-gray-700 focus:outline-2 outline-gray-700 transition-all duration-200 shadow-md outline-none'
                    />
                </div>

                {/* Profession */}
                <div>
                    <p className="font-bold text-white text-lg px-1 pt-1">Profession</p>
                    <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Profession"
                        className='bg-gray-400 rounded-xl border-[#362F5E] p-2 hover:outline-2 outline-gray-700 focus:outline-2 outline-gray-700 transition-all duration-200 shadow-md outline-none'
                    />
                </div>
            </div>
        </div>
    );
}

export default UserParams;