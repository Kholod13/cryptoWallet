import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';

const ProtectedRoute = () => {
    // Берем токен из твоего authSlice
    const { token } = useAppSelector((state) => state.auth);

    // Если токена нет — отправляем на страницу логина
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Если токен есть — разрешаем просмотр вложенных роутов
    return <Outlet />;
};

export default ProtectedRoute;