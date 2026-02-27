import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Описываем типы
interface Asset {
    id: string;      // 'bitcoin', 'ethereum' (id из CoinCap)
    symbol: string;  // 'btc'
    amount: number;
}

interface ConnectedWallet {
    id: string;      // UUID
    address: string; // 0x...
    label: string;   // 'Main Wallet'
    currency: string;
    color: string;
    balance: number;
    isLoading?: boolean;
    isManual?: boolean;
}

export const fetchWalletBalance = createAsyncThunk(
    'wallet/fetchBalance',
    async (wallet: { id: string; address: string; network: string }) => {
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;

        // Определяем настройки в зависимости от того, что ввел юзер
        let baseUrl = "https://api.etherscan.io/v2/api";
        let chainId = "1"; // По умолчанию Ethereum

        if (wallet.network.toLowerCase() === 'polygon') {
            baseUrl = "https://api.polygonscan.com/v2/api";
            chainId = "137";
        } else if (wallet.network.toLowerCase() === 'bsc') {
            baseUrl = "https://api.bscscan.com/v2/api";
            chainId = "56";
        }
        // ... и так далее

        const url = `${baseUrl}?chainid=${chainId}&module=account&action=balance&address=${wallet.address}&tag=latest&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        // ВАЖНО: У каждой сети может быть свой ключ API, но Etherscan V2
        // часто позволяет использовать один ключ для своих дочерних сетей.

        const balance = parseFloat(data.result) / 10**18;
        return { id: wallet.id, balance };
    }
);

interface WalletState {
    myAssets: Asset[];
    connectedWallets: ConnectedWallet[]; // Добавили в интерфейс
}

// 2. Загрузка из localStorage (чтобы данные не пропадали)
const savedWallets = localStorage.getItem('crypto_wallets');
const savedAssets = localStorage.getItem('crypto_assets');

const initialState: WalletState = {
    myAssets: savedAssets ? JSON.parse(savedAssets) : [
        { id: 'tether', symbol: 'usdt', amount: 1200 }, // Дефолт для теста
    ],
    connectedWallets: savedWallets ? JSON.parse(savedWallets) : [],
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        addWallet: (state, action: PayloadAction<ConnectedWallet>) => {
            state.connectedWallets.push(action.payload);
            localStorage.setItem('crypto_wallets', JSON.stringify(state.connectedWallets));
        },
        deleteWallet: (state, action: PayloadAction<string>) => {
            state.connectedWallets = state.connectedWallets.filter(w => w.id !== action.payload);
            localStorage.setItem('crypto_wallets', JSON.stringify(state.connectedWallets));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWalletBalance.pending, (state, action) => {
                // Находим кошелек и ставим ему статус загрузки
                const wallet = state.connectedWallets.find(w => w.id === action.meta.arg.id);
                if (wallet) wallet.isLoading = true;
            })
            .addCase(fetchWalletBalance.fulfilled, (state, action) => {
                console.log("Данные из API получены:", action.payload);

                const wallet = state.connectedWallets.find(w => w.id === action.payload.id);
                if (wallet) {
                    wallet.balance = action.payload.balance;
                    wallet.isLoading = false;
                    // Сохраняем в память обновленный баланс
                    localStorage.setItem('crypto_wallets', JSON.stringify(state.connectedWallets));
                }
            })
            .addCase(fetchWalletBalance.rejected, (state, action) => {
                console.log("!!! Экшен REJECTED (отклонен):", action.error.message); // ЛОГ 5
                const wallet = state.connectedWallets.find(w => w.id === action.meta.arg.id);
                if (wallet) wallet.isLoading = false;
            });
    }
});

export const { addWallet, deleteWallet } = walletSlice.actions;
export default walletSlice.reducer;