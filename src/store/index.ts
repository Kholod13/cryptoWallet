import {configureStore} from "@reduxjs/toolkit";
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import toastReducer from './slices/toastSlice';
import marketReducer from './slices/marketSlice';
import walletReducer from './slices/walletSlice';
import walletsReducer from './slices/arrayWalletsSlice';

import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        user: userReducer,
        toast: toastReducer,
        market: marketReducer,
        wallet: walletReducer,
        wallets: walletsReducer, // test for practice
    }
})

//Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;