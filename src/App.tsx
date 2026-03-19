import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import Wallets from "./pages/Wallets";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import AuthPage from "./pages/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import {useAppDispatch, useAppSelector} from "./store";
import {useEffect} from "react";
import {fetchMe} from './store/slices/authSlice'
import {fetchSourceBalances, fetchUserSources, syncExchangeBalances} from "./store/slices/walletSlice.ts";
import {setTheme} from "./store/slices/uiSlice.ts";
import {useTranslation} from "react-i18next";

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const token = useAppSelector(state => state.auth.token);
    const { i18n } = useTranslation();

    const { connectedWallets } = useAppSelector(state => state.wallet);

    useEffect(() => {
        if (user?.theme) {
            // Когда данные юзера прилетели из базы, обновляем визуальную тему в uiSlice
            dispatch(setTheme(user.theme as 'light' | 'dark'));
        }
    }, [user?.theme, dispatch]);

    useEffect(() => {
        if (user?.language) {
            i18n.changeLanguage(user.language);
        }
    }, [user?.language]);

    useEffect(() => {
        if (connectedWallets.length > 0) {
            connectedWallets.forEach(wallet => {
                // Если кошелек загружен, но данных о монетах нет - обновляем
                if ((!wallet.assets || wallet.assets.length === 0) && !wallet.isLoading) {
                    if (wallet.type === 'web3') {
                        dispatch(fetchSourceBalances(wallet));
                    } else if (wallet.type === 'exchange') {
                        dispatch(syncExchangeBalances(wallet as any));
                    }
                }
            });
        }
    }, [connectedWallets.length, dispatch]);

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