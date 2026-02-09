import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastState {
    toasts: Toast[];
}

const initialState: ToastState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        //add message
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            state.toasts.push({
                ...action.payload,
                id: Date.now().toString(),
            });
        },
        //remove specific message
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;