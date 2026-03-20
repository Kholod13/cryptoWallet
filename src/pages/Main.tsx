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
        <div className={`flex flex-col lg:flex-row min-h-screen transition-colors duration-700 ${isDark ? 'dark bg-[#12141C]' : 'light bg-[#F1F5F9]'}`}>

            <Navbar />

            <div className="flex flex-col flex-1 min-w-0">
                <Header />

                <main className={`
            /* Базовые настройки */
            flex flex-col flex-1
            transition-all duration-700
            
            /* Отступы: на мобилке даемpb-32 (128px), на десктопе убираем его */
            p-4 md:p-8 lg:p-10
            pb-4 lg:pb-8
            
            /* Цвета темы */
            ${isDark ? 'bg-[#181B24]/50' : 'bg-white/20'} 
        `}>
                    <div className="flex-1"> {/* Дополнительная обертка для стабильности */}
                        <Outlet />
                    </div>

                    {/*
               ХАК ДЛЯ МОБИЛОК:
               Если pb-32 не помогает, мы добавляем невидимый блок
               высотой с Navbar в самый низ main
            */}
                    <div className="h-20 lg:hidden" aria-hidden="true" />
                </main>
            </div>
        </div>
    )
}

export default Main;