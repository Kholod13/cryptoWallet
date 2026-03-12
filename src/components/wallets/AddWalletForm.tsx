import { useState } from 'react';
import { Wallet, Smartphone, Landmark, LayoutGrid } from 'lucide-react';
import { useAppDispatch } from '../../store';
import {addSource, syncExchangeBalances} from '../../store/slices/walletSlice';

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

    const [passphrase, setPassphrase] = useState('');

    const handleSave = () => {
        const newId = crypto.randomUUID();
        dispatch(addSource({
            id: newId,
            label: name || platform.name,
            type: platform.type as any,
            platform: platform.id as any,
            apiKey,
            apiSecret,
            passphrase,
            color: '#362F5E',
            assets: []
        }));

        // Если это биржа, сразу запускаем синхронизацию
        if (platform.type === 'exchange') {
            dispatch(syncExchangeBalances({
                id: newId, platform: platform.id, apiKey, apiSecret, passphrase
            }));
        }

        // Очистка
        setApiKey('');
        setApiSecret('');
        setName('');
        setPassphrase('');
    };

    return (
        <div className="bg-[#161B26] p-6 rounded-[32px] text-white w-full max-w-md shadow-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-6">Connect Source</h3>

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
        </div>
    );
};

export default AddWalletForm;