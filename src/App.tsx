import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import Wallets from "./pages/Wallets";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
// Импортируй новые страницы (создай пустые файлы, если их еще нет)
import AuthPage from "./pages/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import {useAppDispatch, useAppSelector} from "./store";
import {useEffect} from "react";
import {fetchMe} from './store/slices/authSlice'
import {fetchUserSources} from "./store/slices/walletSlice.ts";

function App() {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.auth.token);

    useEffect(() => {
        if(token) {
            dispatch(fetchMe());
            dispatch(fetchUserSources());
        }
    }, [dispatch, token]);

    return (
        <BrowserRouter>
            <Routes>
                {/* --- ПУБЛИЧНЫЕ РОУТЫ --- */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />

                {/* --- ЗАЩИЩЕННЫЕ РОУТЫ --- */}
                <Route element={<ProtectedRoute />}>
                    {/* Main — это твой Layout с навигацией */}
                    <Route path="/" element={<Main />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="wallets" element={<Wallets />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* Редирект со всех несуществующих страниц на главную */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;