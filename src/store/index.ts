import {configureStore} from "@reduxjs/toolkit";
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        user: userReducer,
    }
})

//Типы для хуков (важно для TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;