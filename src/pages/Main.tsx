import Navbar from '../components/layout/Navbar.tsx'
import Header from "../components/layout/Header.tsx";
import { Outlet } from "react-router-dom";

const Main = () => {
    return (
        <div className="flex">
            <Navbar />
            <div>
                <Header />
                {/* blocks container */}
                <div className='flex'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Main;