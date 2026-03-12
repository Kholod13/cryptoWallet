import Navbar from '../components/layout/Navbar.tsx'
import Header from "../components/layout/Header.tsx";
import { Outlet } from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store";
import {fetchFiatRates} from "../store/slices/marketSlice.ts";
import {useEffect} from "react";

const Main = () => {
    const dispatch = useAppDispatch();
    // Looking at mainCurrency in userSlice
    const user = useAppSelector((state) => state.auth.user);

    // Витягуємо валюту безпечно. Якщо user === null (йде завантаження), ставимо 'USD'
    const mainCurrency = user?.mainCurrency || 'USD';

    useEffect(() => {
        dispatch(fetchFiatRates());         // Новый запрос курсов валют
    }, [mainCurrency, dispatch]);

    return (
        <div className="flex">
            <Navbar />
            <div className="flex flex-col min-h-screen flex-1">
                <Header />
                {/* blocks container */}
                <div className='flex flex-col flex-1 bg-neutral-200 py-6 px-10'>
                    <Outlet  />
                </div>
            </div>
        </div>
    )
}
export default Main;