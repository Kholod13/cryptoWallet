import Navbar from '../components/layout/Navbar.tsx'
import Header from "../components/layout/Header.tsx";
import { Outlet } from "react-router-dom";
import {useState} from "react";

const Main = () => {
    const [title, setTitle] = useState("Dashboard");

    return (
        <div className="flex">
            <Navbar />
            <div className="flex flex-col flex-1">
                <Header title={title} />
                {/* blocks container */}
                <div className='flex flex-col flex-1 bg-neutral-200 py-6 px-10'>
                    <Outlet context={{ setTitle }} />
                </div>
            </div>
        </div>
    )
}
export default Main;