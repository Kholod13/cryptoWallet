import { useState } from 'react';
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
    RefreshCcw,
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import {fetchSourceBalances, saveSourceToDb, syncExchangeBalances} from '../../store/slices/walletSlice';
import {AnimatePresence, motion} from "framer-motion";

const PLATFORMS = [
    { id: 'metamask', name: 'MetaMask', type: 'web3', icon: Wallet },
    { id: 'binance', name: 'Binance', type: 'exchange', icon: Landmark },
    { id: 'okx', name: 'OKX', type: 'exchange', icon: LayoutGrid },
    { id: 'trustwallet', name: 'Trust Wallet', type: 'web3', icon: Smartphone },
];

export const AddWalletForm = () => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState(PLATFORMS[0]);
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const [passphrase, setPassphrase] = useState('');

    const handleSave = () => {
        const newId = crypto.randomUUID();

        // Данные, которые мы сохраняем
        const newSource = {
            id: newId,
            label: name || platform.name,
            type: platform.type as any,
            platform: platform.id as any,
            apiKey,      // Для кошелька это 0x... адрес, для биржи это API Key
            apiSecret,   // Только для бирж
            passphrase,  // Только для OKX
            color: '#362F5E',
            assets: []
        };

        // 1. Сохраняем в базу данных (PostgreSQL)
        dispatch(saveSourceToDb(newSource));

        // 2. ЗАПУСКАЕМ СИНХРОНИЗАЦИЮ
        if (platform.type === 'exchange') {
            // Логика для Binance / OKX
            dispatch(syncExchangeBalances({
                id: newId,
                platform: platform.id,
                apiKey,
                apiSecret,
                passphrase
            }));
        } else if (platform.type === 'web3') {
            // ЛОГИКА ДЛЯ METAMASK / TRUST WALLET (Moralis)
            // ВАЖНО: вызываем Thunk, который идет на твой роут /api/wallet/scan
            dispatch(fetchSourceBalances(newSource));
        }

        // 3. Очистка полей
        setApiKey('');
        setApiSecret('');
        setName('');
        setPassphrase('');
    };

    return (
        <div className="bg-[#161B26] p-6 rounded-[32px] text-white w-full max-w-md shadow-2xl border border-white/5">
            <div className='flex gap-3 items-center'>
                <h3 className="text-xl font-bold mb-6">Connect Source</h3>
                <div
                    onClick={() => setIsHelpOpen(true)}
                    className="cursor-pointer hover:scale-110 transition-transform text-gray-500 hover:text-[#362F5E]"
                >
                    <CircleHelp size={22} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 mb-6">
                {PLATFORMS.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setPlatform(p)}
                        className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${platform.id === p.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/5'}`}
                    >
                        <p.icon size={18} />
                        <span className="text-sm">{p.name}</span>
                    </button>
                ))}
            </div>
            {/* INPUTS BASIC */}
            <input
                placeholder="Label (e.g. My Savings)"
                className="w-full bg-black/20 p-4 rounded-2xl mb-4 outline-none border border-white/5 focus:border-blue-500"
                value={name} onChange={e => setName(e.target.value)}
            />

            <input
                placeholder="API Key or address"
                value={apiKey}
                className="w-full bg-black/20 p-4 rounded-2xl mb-4 outline-none border border-white/5 focus:border-blue-500"
                onChange={e => setApiKey(e.target.value)}
            />

            {/* INPUTS OPTIONAL */}
            {platform.type === 'exchange' && (
                <>
                    <input
                        placeholder="API Secret"
                        type="password"
                        value={apiSecret}
                        onChange={e => setApiSecret(e.target.value)}
                        className="w-full bg-black/20 p-4 rounded-2xl mb-4 outline-none border border-white/5 focus:border-blue-500"
                    />
                </>
            )}
            {platform.id === 'okx' && (
                <input
                    type="password"
                    placeholder="API Passphrase"
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    className="w-full bg-black/20 p-4 rounded-2xl mb-4 outline-none border border-white/5 focus:border-blue-500"
                />
            )}
            <button onClick={handleSave} className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all">
                Connect {platform.name}
            </button>

            {/* --- ВСПЛЫВАЮЩЕЕ ОКНО ПОМОЩИ (MODAL) --- */}
            <AnimatePresence>
                {isHelpOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 text-left">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHelpOpen(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#161B26] border border-white/10 w-full max-w-xl rounded-[40px] p-10 shadow-2xl text-white overflow-hidden"
                        >
                            {/* Декоративное свечение внутри модалки */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <Info className="text-blue-400" size={28} />
                                        Connection Guide
                                    </h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Setup your digital assets</p>
                                </div>
                                <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                                    <X size={24} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="space-y-8 overflow-y-auto max-h-[65vh] pr-4 custom-scrollbar relative z-10">

                                {/* Section 1: Web3 */}
                                <div className="flex gap-5">
                                    <div className="p-3.5 h-fit bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                                        <Wallet size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Web3 Wallets (MetaMask, Trust)</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed mt-1">
                                            You only need your <span className="text-blue-400 font-mono">Public Address</span> (starts with 0x...). Simply copy it from your wallet and paste it into the address field. No private keys are ever required!
                                        </p>
                                    </div>
                                </div>

                                {/* Section 2: CEX API */}
                                <div className="flex gap-5">
                                    <div className="p-3.5 h-fit bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                        <Key size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Exchanges (Binance, OKX)</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed mt-1">
                                            Go to the <span className="text-white italic">API Management</span> section on your exchange. You will need to generate an <span className="text-emerald-400 font-bold">API Key</span> and an <span className="text-emerald-400 font-bold">API Secret</span>.
                                        </p>
                                        <div className="mt-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-start gap-3">
                                            <ShieldCheck size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <p className="text-xs text-emerald-500/80 italic font-medium">
                                                CRITICAL: Always set permissions to <b>"Read-only"</b>. Disable "Withdrawal" and "Trade" for maximum security.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: OKX Exception */}
                                <div className="flex gap-5">
                                    <div className="p-3.5 h-fit bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
                                        <Lock size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white font-mono uppercase tracking-tighter">OKX Specifics</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed mt-1">
                                            Unlike Binance, OKX requires a <span className="text-amber-400 font-bold">Passphrase</span>. This is a unique password you create <b>manually</b> while setting up the API key. You must enter all three: Key, Secret, and Passphrase.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 4: Sync */}
                                <div className="flex gap-5">
                                    <div className="p-3.5 h-fit bg-slate-500/10 rounded-2xl text-slate-400 border border-white/5">
                                        <RefreshCcw size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Real-time Synchronization</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed mt-1">
                                            After adding a source, use the <b>Refresh</b> icon on the wallet card to fetch live balances directly from the blockchain or exchange servers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsHelpOpen(false)}
                                className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/30 cursor-pointer"
                            >
                                Understood
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>

    );
};

export default AddWalletForm;