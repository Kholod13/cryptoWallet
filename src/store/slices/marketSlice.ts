import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
    fiatRates: Record<string, number>;
    isLoading: boolean;
    error: string | null;
}

export const fetchFiatRates = createAsyncThunk('market/fetchFiatRates', async () => {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const json = await response.json();
    return json.rates;
});

export const fetchCoins = createAsyncThunk('market/fetchCoins', async () => {
    // CoinLore URL
    const response = await fetch('https://api.coinlore.net/api/tickers/?start=0&limit=100');
    if (!response.ok) throw new Error('Server error');
    const json = await response.json();

    return json.data.map((coin: any) => ({
        id: coin.nameid, // Используем текстовый ID для будущих графиков
        symbol: coin.symbol,
        name: coin.name,
        image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
        current_price: parseFloat(coin.price_usd),
        market_cap: parseFloat(coin.market_cap_usd),
        market_cap_rank: parseInt(coin.rank),
        price_change_percentage_24h: parseFloat(coin.percent_change_24h),
    })) as Coin[];
});

const initialState: MarketState = {
    coins: [],
    fiatRates: { USD: 1 },
    isLoading: false,
    error: null,
};

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoins.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCoins.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coins = action.payload;
            })
            .addCase(fetchFiatRates.fulfilled, (state, action) => {
                state.fiatRates = action.payload;
            })
            .addCase(fetchCoins.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error';
            });
    },
});

export default marketSlice.reducer;