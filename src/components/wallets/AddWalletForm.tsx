import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Wallet,
    Smartphone,
    Landmark,
    LayoutGrid,
    CircleHelp,
    Info,
    X,
    ShieldCheck,
    Key,
    Lock,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSourceBalances, saveSourceToDb, syncExchangeBalances } from '../../store/slices/walletSlice';
import { motion } from "framer-motion";
import {useTranslation} from "react-i18next";

const PLATFORMS = [
    { id: 'metamask', name: 'MetaMask', type: 'web3' as const, icon: Wallet },
    { id: 'binance', name: 'Binance', type: 'exchange' as const, icon: Landmark },
    { id: 'okx', name: 'OKX', type: 'exchange' as const, icon: LayoutGrid },
    { id: 'trustwallet', name: 'Trust Wallet', type: 'web3' as const, icon: Smartphone },
];

export const AddWalletForm = () => {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector((state) => state.ui);
    const isDark = theme === 'dark';
    const { t } = useTranslation();

    // Состояние формы (объединил в один объект для handleChange)
    const [formData, setFormData] = useState({
        name: '',
        apiKey: '',
        apiSecret: '',
        passphrase: ''
    });

    const [platform, setPlatform] = useState(PLATFORMS[0]);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Функция обновления полей (исправлено)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.apiKey) return;

        const newId = crypto.randomUUID();
        const newSource = {
            id: newId,
            label: formData.name || platform.name,
            type: platform.type,
            platform: platform.id as any,
            apiKey: formData.apiKey,
            apiSecret: formData.apiSecret,
            passphrase: formData.passphrase,
            color: '#362F5E',
            assets: []
        };

        dispatch(saveSourceToDb(newSource));

        if (platform.type === 'exchange') {
            dispatch(syncExchangeBalances({
                id: newId,
                platform: platform.id,
                apiKey: formData.apiKey,
                apiSecret: formData.apiSecret,
                passphrase: formData.passphrase
            }));
        } else if (platform.type === 'web3') {
            dispatch(fetchSourceBalances(newSource));
        }

        // Очистка (исправлено)
        setFormData({ name: '', apiKey: '', apiSecret: '', passphrase: '' });
    };

    return (
        <div className={`relative p-[1px] rounded-[40px] transition-all duration-500 shadow-2xl h-fit
            ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-slate-200 to-white'}
        `}>
            <div className={`relative z-10 p-8 rounded-[39px] backdrop-blur-[20px] transition-colors duration-500
                ${isDark ? 'bg-[#161B26]/80' : 'bg-white/80'}
            `}>

                <div className='flex justify-between items-center mb-8'>
                    <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {t('wallets.add_wallet.title')}
                    </h3>
                    <div
                        onClick={() => setIsHelpOpen(true)}
                        className={`cursor-pointer hover:scale-110 transition-transform ${isDark ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-500'}`}
                    >
                        <CircleHelp size={24} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {PLATFORMS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setPlatform(p)}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer font-bold text-sm
                                ${platform.id === p.id
                                ? (isDark ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-[#362F5E] bg-[#362F5E]/5 text-[#362F5E]')
                                : (isDark ? 'border-white/5 bg-white/5 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400')
                            }
                            `}
                        >
                            <p.icon size={20} />
                            <span>{p.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-4 text-left">
                    <div className="space-y-1.5 text-left">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('wallets.add_wallet.inputs.name')}</label>
                        <input
                            name="name"
                            placeholder="e.g. Main Wallet"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-2xl outline-none border-2 transition-all font-bold
                                ${isDark
                                ? 'bg-black/20 border-transparent focus:border-[#362F5E] text-white placeholder:text-slate-800'
                                : 'bg-slate-100/50 border-slate-100 focus:border-[#362F5E] text-slate-900 placeholder:text-slate-300'}
                            `}
                        />
                    </div>

                    <div className="space-y-1.5 text-left">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {platform.type === 'web3' ? t('wallets.add_wallet.inputs.address') : t('wallets.add_wallet.inputs.key')}
                        </label>
                        <input
                            name="apiKey"
                            placeholder={platform.type === 'web3' ? "0x..." : "Your API Key"}
                            value={formData.apiKey}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-2xl outline-none border-2 transition-all font-mono text-sm
                                ${isDark
                                ? 'bg-black/20 border-transparent focus:border-[#362F5E] text-blue-400 placeholder:text-slate-800'
                                : 'bg-slate-100/50 border-slate-100 focus:border-[#362F5E] text-blue-600 placeholder:text-slate-300'}
                            `}
                        />
                    </div>

                    {platform.type === 'exchange' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('wallets.add_wallet.inputs.secret')}</label>
                            <input
                                name="apiSecret"
                                placeholder="••••••••••••"
                                type="password"
                                value={formData.apiSecret}
                                onChange={handleChange}
                                className={`w-full p-4 rounded-2xl outline-none border-2 transition-all
                                    ${isDark
                                    ? 'bg-black/20 border-transparent focus:border-[#362F5E] text-white'
                                    : 'bg-slate-100/50 border-slate-100 focus:border-[#362F5E] text-slate-900'}
                                `}
                            />
                        </motion.div>
                    )}

                    {platform.id === 'okx' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('wallets.add_wallet.inputs.passphrase')}</label>
                            <input
                                name="passphrase"
                                type="password"
                                placeholder="Your API Passphrase"
                                value={formData.passphrase}
                                onChange={handleChange}
                                className={`w-full p-4 rounded-2xl outline-none border-2 transition-all
                                    ${isDark
                                    ? 'bg-black/20 border-transparent focus:border-[#362F5E] text-white'
                                    : 'bg-slate-100/50 border-slate-100 focus:border-[#362F5E] text-slate-900'}
                                `}
                            />
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    className={`w-full mt-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl cursor-pointer
                        ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' : 'bg-[#362F5E] hover:opacity-90 text-white shadow-slate-200'}
                    `}
                >
                    {t('wallets.add_wallet.button')} {platform.name}
                </button>
            </div>

            {/* ПОРТАЛ (Исправлено - портал обернут в AnimatePresence условие) */}
            {isHelpOpen && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setIsHelpOpen(false)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative w-full max-w-xl rounded-[40px] p-10 shadow-2xl border overflow-hidden
                            ${isDark ? 'bg-[#161B26] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}
                        `}
                    >
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex justify-between items-center mb-8 relative z-10 text-left">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-left">
                                    <Info className="text-blue-500" size={28} />
                                    {t('wallets.add_wallet.guide.title')}
                                </h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    {t('wallets.add_wallet.guide.undertitle')}
                                </p>
                            </div>
                            <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-white/5 rounded-full cursor-pointer">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar relative z-10 text-left">
                            <div className="flex gap-5">
                                <div className={`p-3.5 h-fit rounded-2xl bg-blue-500/10 text-blue-500 border ${isDark ? 'border-blue-500/20' : 'border-blue-500/10'}`}>
                                    <Wallet size={24}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{t('wallets.add_wallet.guide.web3.title')}</h4>
                                    <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {t('wallets.add_wallet.guide.web3.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className={`p-3.5 h-fit rounded-2xl bg-emerald-500/10 text-emerald-500 border ${isDark ? 'border-emerald-500/20' : 'border-emerald-500/10'}`}>
                                    <Key size={24}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{t('wallets.add_wallet.guide.exchanges.title')}</h4>
                                    <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {t('wallets.add_wallet.guide.exchanges.description')}
                                    </p>
                                    <div className="mt-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-start gap-3">
                                        <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-amber-600 italic font-medium leading-tight">
                                            {t('wallets.add_wallet.guide.exchanges.enable')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className={`p-3.5 h-fit rounded-2xl bg-amber-500/10 text-amber-400 border ${isDark ? 'border-amber-500/20' : 'border-amber-500/10'}`}>
                                    <Lock size={24}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{t('wallets.add_wallet.guide.okx.title')}</h4>
                                    <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {t('wallets.add_wallet.guide.okx.description')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsHelpOpen(false)}
                            className={`w-full mt-10 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer
                                ${isDark ? 'bg-blue-600' : 'bg-[#362F5E]'}
                            `}
                        >
                            {t('wallets.add_wallet.guide.button')}
                        </button>
                    </motion.div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AddWalletForm;