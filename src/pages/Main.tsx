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
        <div className={`
            /* На мобилках - колонка, на десктопе - ряд */
            flex flex-col lg:flex-row 
            min-h-screen transition-colors duration-700 
            ${isDark ? 'dark bg-[#12141C]' : 'light bg-[#F1F5F9]'}
        `}>

            {/* Navbar сам адаптируется (мы обновим его код следующим шагом) */}
            <Navbar />

            <div className="flex flex-col flex-1 min-w-0">
                <Header />

                {/*
                   На мобилках уменьшаем паддинги (px-4),
                   на планшетах (md:px-10),
                   добавляем отступ снизу (pb-24), чтобы контент не перекрывался нижним меню
                */}
                <main className={`
                    flex flex-col flex-1 
                    p-4 md:p-8 lg:p-10 
                    pb-24 lg:pb-10 
                    transition-colors duration-700
                    ${isDark ? 'bg-[#181B24]/50' : 'bg-white/20'} 
                `}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Main;