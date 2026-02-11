import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string;
    profession: string;
    avatarUrl: string;
    mainCurrency: string;
}

// Create const for guest
const GUEST_USER: UserState = {
    username: 'Guest',
    profession: 'Crypto User',
    avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+',
    mainCurrency: 'USD',
};

// Function for starter state
const getInitialState = (): UserState => {
    const saved = localStorage.getItem('crypto_user');
    if (saved) {
        try {
            return JSON.parse(saved);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return GUEST_USER;
        }
    }
    return GUEST_USER;
};

const userSlice = createSlice({
    name: 'user',
    initialState: getInitialState(), //call when started
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            // Update state
            Object.assign(state, action.payload);

            // Save current state to localStorage
            localStorage.setItem('crypto_user', JSON.stringify(state));
        },
        logoutUser: () => {
            // Delete data
            localStorage.removeItem('crypto_user');
            // Return guest
            return GUEST_USER;
        }
    },
});

export const { updateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;