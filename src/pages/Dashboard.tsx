import CoinMarket from "../components/dashboard/CoinMarket/CoinMarket.tsx";
import MainBalance from "../components/dashboard/MainBalance.tsx";
import {useAppSelector, useAppDispatch} from "../store";
import {useEffect} from "react";
import AggregatedAssets from "../components/dashboard/AggregatedAssets.tsx";
import {PnLAnalytics} from "../components/dashboard/PnLAnalytics.tsx";
const Dashboard = () => {
    const user = useAppSelector((state) => state.auth.user);

    // Витягуємо валюту безпечно. Якщо user === null (йде завантаження), ставимо 'USD'
    const mainCurrency = user?.mainCurrency || 'USD';
    const dispatch = useAppDispatch();

    useEffect(() => {
    }, [dispatch, mainCurrency]);

    return (
        <div className="flex flex-col justify-between gap-5">
            <div className="flex gap-5 justify-between">
                <MainBalance />
                <PnLAnalytics/>
            </div>
            <AggregatedAssets />
            <CoinMarket />

        </div>
    )
}
export default Dashboard;