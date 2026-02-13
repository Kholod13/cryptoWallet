import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Asset {
    id: string;      // 'bitcoin'
    symbol: string;  // 'btc'
    amount: number;
}

interface WalletState {
    myAssets: Asset[];
}

// Testing data
const initialState: WalletState = {
    myAssets: [
        { id: 'tether', symbol: 'usdt', amount: 1000 },
    ],
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        addAsset: (state, action: PayloadAction<Asset>) => {
            const existing = state.myAssets.find(a => a.id === action.payload.id);
            if (existing) {
                existing.amount += action.payload.amount;
            } else {
                state.myAssets.push(action.payload);
            }
        },
    },
});

export const { addAsset } = walletSlice.actions;
export default walletSlice.reducer;