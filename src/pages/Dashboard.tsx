import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

const Dashboard = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {setTitle}: string = useOutletContext();

    useEffect(() => {
        setTitle("Dashboard");
    }, []);

    return (
        <div className="flex flex-1">
            <h1>Dashboard</h1>

        </div>
    )
}
export default Dashboard;