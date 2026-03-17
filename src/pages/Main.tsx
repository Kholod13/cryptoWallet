import Navbar from '../components/layout/Navbar.tsx'
import Header from "../components/layout/Header.tsx";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchFiatRates } from "../store/slices/marketSlice.ts";
import { useEffect } from "react";

const Main = () => {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector((state) => state.ui);

    const isDark = theme === 'dark';

    useEffect(() => {
        dispatch(fetchFiatRates());
    }, [dispatch]);

    return (
        /*
           Используем #12141C для темной (мягкий темно-синий/черный)
           и #F1F5F9 для светлой (мягкий голубовато-серый)
        */
        <div className={`flex min-h-screen transition-colors duration-700 ${isDark ? 'dark bg-[#12141C]' : 'light bg-[#F1F5F9]'}`}>

            <Navbar />

            <div className="flex flex-col flex-1">
                <Header />

                {/* Основной контент с легким внутренним отступом и более мягким фоном */}
                <main className={`
                    flex flex-col flex-1 py-6 px-10 transition-colors duration-700
                    ${isDark ? 'bg-[#181B24]/50' : 'bg-white/20'} 
                `}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Main;