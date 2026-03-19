import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Available languages
export type LanguageMode = 'EN' | 'CZ' | 'UA';

interface UIState {
    pageTitleKey: string; // Храним ключ, а не текст!
    theme: 'light' | 'dark';
    language: LanguageMode;
}

const initialState: UIState = {
    pageTitleKey: 'common.dashboard',
    theme: (localStorage.getItem('app_theme') as any) || 'light',
    language: (localStorage.getItem('app_lang') as LanguageMode) || 'EN',
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setPageTitle: (state, action: PayloadAction<string>) => {
            state.pageTitleKey = action.payload;
        },
        setLanguage: (state, action: PayloadAction<LanguageMode>) => {
            state.language = action.payload;
            localStorage.setItem('app_lang', action.payload);
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('app_theme', action.payload);
        }
    }
});

export const { setPageTitle, setLanguage, setTheme } = uiSlice.actions;
export default uiSlice.reducer;