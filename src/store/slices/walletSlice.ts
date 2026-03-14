import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface TokenAsset {
    symbol: string;
    amount: number;
}

export interface ConnectedSource {
    id: string;
    label: string;
    type: 'web3' | 'exchange' | 'manual';
    platform: 'metamask' | 'trustwallet' | 'binance' | 'okx' | 'ethereum';
    apiKey?: string;
    apiSecret?: string;
    passphrase?: string;
    color: string;
    assets: TokenAsset[];
    isLoading?: boolean;
}

interface WalletState {
    connectedWallets: ConnectedSource[];
}

// 1. Твой существующий Thunk для Бирж (через твой Бэкенд)
export const syncExchangeBalances = createAsyncThunk(
    'wallet/syncExchange',
    async (params: { id: string, platform: string, apiKey: string, apiSecret: string, passphrase?: string }, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/exchange/balances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return { sourceId: params.id, assets: data.assets };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Thunk для Web3 кошельков (через Etherscan API напрямую)
export const fetchSourceBalances = createAsyncThunk(
    'wallet/fetchWeb3Balance',
    async (source: ConnectedSource, { rejectWithValue }) => {
        try {
            const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
            const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${source.apiKey}&tag=latest&apikey=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "1") throw new Error(data.result);

            const ethAmount = parseFloat(data.result) / 10**18;
            return {
                sourceId: source.id,
                assets: [{ symbol: 'eth', amount: ethAmount }]
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserSources = createAsyncThunk(
    'wallet/fetchSources',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/wallets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Thunk для сохранения кошелька в БД (вызывай его вместо addSource в форме)
export const saveSourceToDb = createAsyncThunk(
    'wallet/saveSource',
    async (walletData: ConnectedSource, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/wallets/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(walletData),
            });
            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteSourceFromDb = createAsyncThunk(
    'wallet/deleteFromDb',
    async (walletId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/wallets/${walletId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Could not delete from DB");

            return walletId; // Возвращаем ID удаленного кошелька
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        connectedWallets: [], // Теперь по умолчанию пусто
    } as WalletState,
    reducers: {
        // Оставляем для мгновенного UI-отклика или очистки
        clearWallets: (state) => {
            state.connectedWallets = [];
        },
        // Сохраняем старый addSource для совместимости, но теперь он не главный
        addSource: (state, action: PayloadAction<ConnectedSource>) => {
            state.connectedWallets.push(action.payload);
        },
        deleteSource: (state, action: PayloadAction<string>) => {
            state.connectedWallets = state.connectedWallets.filter(w => w.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteSourceFromDb.fulfilled, (state, action) => {
                // Удаляем из локального стейта только после того, как база подтвердила удаление
                state.connectedWallets = state.connectedWallets.filter(w => w.id !== action.payload);

                // Опционально чистим localStorage, если ты его еще используешь для этого списка
                localStorage.setItem('crypto_sources', JSON.stringify(state.connectedWallets));
            })
            .addCase(fetchUserSources.fulfilled, (state, action) => {
                // ПРЕОБРАЗОВАНИЕ: Добавляем поле assets, если его нет в ответе базы
                state.connectedWallets = action.payload.map((source: any) => ({
                    ...source,
                    assets: source.assets || []
                }));
            })
            // Когда кошелек успешно сохранен в БД
            .addCase(saveSourceToDb.fulfilled, (state, action) => {
                // Инициализируем новый кошелек с пустым массивом активов
                state.connectedWallets.push({
                    ...action.payload,
                    assets: []
                });
            })
            // ОБРАБОТКА БИРЖ (CEX)
            .addCase(syncExchangeBalances.pending, (state, action) => {
                const source = state.connectedWallets.find(w => w.id === action.meta.arg.id);
                if (source) source.isLoading = true;
            })
            .addCase(syncExchangeBalances.fulfilled, (state, action) => {
                const source = state.connectedWallets.find(w => w.id === action.payload.sourceId);
                if (source) {
                    source.assets = action.payload.assets;
                    source.isLoading = false;
                    localStorage.setItem('crypto_sources', JSON.stringify(state.connectedWallets));
                }
            })
            .addCase(syncExchangeBalances.rejected, (state, action) => {
                const source = state.connectedWallets.find(w => w.id === action.meta.arg.id);
                if (source) source.isLoading = false;
            })

            // ОБРАБОТКА КОШЕЛЬКОВ (Web3)
            .addCase(fetchSourceBalances.pending, (state, action) => {
                const source = state.connectedWallets.find(w => w.id === action.meta.arg.id);
                if (source) source.isLoading = true;
            })
            .addCase(fetchSourceBalances.fulfilled, (state, action) => {
                const source = state.connectedWallets.find(w => w.id === action.payload.sourceId);
                if (source) {
                    source.assets = action.payload.assets;
                    source.isLoading = false;
                    localStorage.setItem('crypto_sources', JSON.stringify(state.connectedWallets));
                }
            })
            .addCase(fetchSourceBalances.rejected, (state, action) => {
                const source = state.connectedWallets.find(w => w.id === action.meta.arg.id);
                if (source) source.isLoading = false;
            });
    }
});

export const { addSource, deleteSource, clearWallets } = walletSlice.actions;
export default walletSlice.reducer;