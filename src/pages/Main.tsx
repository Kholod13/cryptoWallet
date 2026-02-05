import Navbar from '../components/layout/Navbar.tsx'
import Header from "../components/layout/Header.tsx";
import { Outlet } from "react-router-dom";

const Main = () => {

    return (
        <div className="flex">
            <Navbar />
            <div className="flex flex-col flex-1">
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