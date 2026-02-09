import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string;
    profession: string;
    avatarUrl: string;
}

// 1. Пытаемся достать данные из localStorage
const savedUser = localStorage.getItem('crypto_user');

// 2. Если данные есть — парсим их, если нет — используем дефолтные
const initialState: UserState = savedUser ? JSON.parse(savedUser) : {
    username: 'Guest',
    profession: 'Crypto User',
    avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            // Обновляем стейт
            const newState = { ...state, ...action.payload };

            // 3. Сохраняем обновленный стейт в localStorage (в виде строки)
            localStorage.setItem('crypto_user', JSON.stringify(newState));

            return newState;
        },
        logoutUser: () => {
            localStorage.removeItem('crypto_user');
            return initialState;
        }
    },
});

export const { updateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
