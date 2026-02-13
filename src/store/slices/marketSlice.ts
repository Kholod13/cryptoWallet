import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// coin type(based on Coingecko)
export interface Coin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}

interface MarketState {
    coins: Coin[];
    isLoading: boolean;
    error: string | null;
}

const initialState: MarketState = {
    coins: [],
    isLoading: false,
    error: null,
};

// async fetch to CoinGecko
export const fetchCoins = createAsyncThunk(
    'market/fetchCoins',
    async (currency: string = 'usd') => { // Добавь = 'usd' здесь как запасной вариант
        const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
        const activeCurrency = (currency || 'usd').toLowerCase();

        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${activeCurrency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
            {
                headers: {
                    'accept': 'application/json',
                    'x-cg-demo-api-key': apiKey
                }
            }
        );
        if (!response.ok) throw new Error('Server error');
        return await response.json();
    }
);

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoins.pending, (state) => { state.isLoading = true; })
            .addCase(fetchCoins.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coins = action.payload;
            })
            .addCase(fetchCoins.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error';
            });
    },
});

export default marketSlice.reducer;