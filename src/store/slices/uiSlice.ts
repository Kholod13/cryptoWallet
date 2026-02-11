import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';
// Available languages
export type LanguageMode = 'EN' | 'CZ' | 'UA';

interface UIState {
    pageTitle: string;
    theme: ThemeMode;
    language: LanguageMode;
}

// Take saved data from browser memory
const savedTheme = localStorage.getItem('app_theme') as ThemeMode;
const savedLang = localStorage.getItem('app_lang') as LanguageMode;

const initialState: UIState = {
    pageTitle: 'Dashboard',
    theme: savedTheme || 'dark',
    language: savedLang || 'EN', // default
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setPageTitle: (state, action: PayloadAction<string>) => {
            state.pageTitle = action.payload;
        },
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.theme = action.payload;
            localStorage.setItem('app_theme', action.payload);
        },
        // Action for switching language
        setLanguage: (state, action: PayloadAction<LanguageMode>) => {
            state.language = action.payload;
            localStorage.setItem('app_lang', action.payload);
        }
    }
})

export const { setPageTitle, setTheme, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;