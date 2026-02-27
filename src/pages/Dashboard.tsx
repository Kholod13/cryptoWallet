import CoinMarket from "../components/dashboard/CoinMarket/CoinMarket.tsx";
import MainBalance from "../components/dashboard/MainBalance.tsx";
import {useAppSelector, useAppDispatch} from "../store";
import {useEffect} from "react";

const Dashboard = () => {
    const { mainCurrency } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
    }, [dispatch, mainCurrency]);

    return (
        <div className="flex flex-1 justify-between">
            <div>
                <MainBalance />
            </div>
            <CoinMarket />
        </div>
    )
}
export default Dashboard;