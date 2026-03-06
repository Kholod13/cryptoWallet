import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    profession: string | null;
    mainCurrency: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
};

// --- АСИНХРОННЫЕ ЭКШЕНЫ ---

// 1. Регистрация (ДОБАВЛЕНО)
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Registration failed');

            localStorage.setItem('token', data.token);
            return data; // Ожидаем { user, token }
        } catch (err: any) {
            return rejectWithValue("Server error");
        }
    }
);

// 2. Логин
export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Login failed');

            localStorage.setItem('token', data.token);
            return data; // Ожидаем { user, token }
        } catch (err: any) {
            return rejectWithValue("Server error");
        }
    }
);

// 3. Получить данные о себе (fetchMe)
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return rejectWithValue("No token");

        const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (err: any) {
        localStorage.removeItem('token');
        return rejectWithValue(err.message);
    }
});

// 4. Обновление профиля
export const updateProfile = createAsyncThunk('auth/updateProfile', async (updateData: Partial<User>, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        });
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.message);
        return data;
    } catch (err: any) {
        return rejectWithValue("Failed to save to database");
    }
});

// --- SLICE ---

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('token');
        },
        resetStatus: (state) => {
            state.isLoading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoading = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoading = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            // Глобальные матчеры для всех асинхронных экшенов этого слайса
            .addMatcher(action => action.type.endsWith('/pending'), (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    // Используем принудительное приведение типа (Type Casting)
                    state.error = (action as PayloadAction<string>).payload || 'Error';
                }
            );
    }
});

export const { logout, clearError, resetStatus } = authSlice.actions;
export default authSlice.reducer;