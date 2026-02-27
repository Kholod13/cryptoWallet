import { useState } from 'react';
import { Pilcrow, Paintbrush2, Codesandbox, Landmark } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addWallet } from '../../store/slices/walletSlice';
import { addToast } from '../../store/slices/toastSlice';

export const AddWalletForm = () => {
    const dispatch = useAppDispatch();

    // Локальный стейт для полей
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [currency, setCurrency] = useState('');
    const [selectedColor, setSelectedColor] = useState('#10b981'); // Дефолтный зеленый

    // Набор красивых цветов для кошельков
    const colors = [
        { hex: '#10b981', name: 'Emerald' },
        { hex: '#3b82f6', name: 'Blue' },
        { hex: '#f43f5e', name: 'Rose' },
        { hex: '#f59e0b', name: 'Amber' },
        { hex: '#8b5cf6', name: 'Purple' },
        { hex: '#64748b', name: 'Slate' },
    ];

    const handleSave = () => {
        if (!name || !address) {
            dispatch(addToast({ message: "Please fill name and address", type: 'error' }));
            return;
        }

        dispatch(addWallet({
            id: crypto.randomUUID(),
            label: name,
            address: address,
            currency: currency,
            color: selectedColor,
            balance: 0,
        }));

        dispatch(addToast({ message: "Wallet connected!", type: 'success' }));

        // Очистка формы
        setName(''); setAddress(''); setCurrency('');
    };

    return (
        <div className="flex flex-col bg-[#362F5E] rounded-3xl text-white w-full max-w-md p-8 gap-6 shadow-2xl border border-white/10">
            <p className='text-center font-black text-2xl tracking-tight'>Add New Wallet</p>

            <div className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10 focus-within:border-white/40 transition-all">
                    <div className="pl-3 text-slate-400"><Pilcrow size={20}/></div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full bg-transparent p-2 outline-none placeholder:text-slate-500'
                        type="text"
                        placeholder="Wallet name (e.g. MetaMask)"
                    />
                </div>

                {/* Address */}
                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10 focus-within:border-white/40 transition-all">
                    <div className="pl-3 text-slate-400"><Codesandbox size={20}/></div>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className='w-full bg-transparent p-2 outline-none placeholder:text-slate-500'
                        type="text"
                        placeholder="Wallet Address (0x...)"
                    />
                </div>

                {/* Currency */}
                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10 focus-within:border-white/40 transition-all">
                    <div className="pl-3 text-slate-400"><Landmark size={20}/></div>
                    <input
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className='w-full bg-transparent p-2 outline-none placeholder:text-slate-500'
                        type="text"
                        placeholder="Network (e.g. Ethereum)"
                    />
                </div>

                {/* COLOR PALETTE */}
                <div className="flex items-center gap-4">
                    <div className="text-slate-400"><Paintbrush2 size={20}/></div>
                    <div className="flex gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => setSelectedColor(color.hex)}
                                className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer ${
                                    selectedColor === color.hex
                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#362F5E] scale-110'
                                        : 'opacity-50 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default AddWalletForm;