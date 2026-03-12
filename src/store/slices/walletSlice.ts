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

const initialState: WalletState = {
    connectedWallets: JSON.parse(localStorage.getItem('crypto_sources') || '[]'),
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        addSource: (state, action: PayloadAction<ConnectedSource>) => {
            state.connectedWallets.push(action.payload);
            localStorage.setItem('crypto_sources', JSON.stringify(state.connectedWallets));
        },
        deleteSource: (state, action: PayloadAction<string>) => {
            state.connectedWallets = state.connectedWallets.filter(w => w.id !== action.payload);
            localStorage.setItem('crypto_sources', JSON.stringify(state.connectedWallets));
        }
    },
    extraReducers: (builder) => {
        builder
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

export const { addSource, deleteSource } = walletSlice.actions;
export default walletSlice.reducer;