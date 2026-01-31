import Navbar from '../components/layout/Navbar.tsx'
import Header from "../components/layout/Header.tsx";

const Dashboard = () => {
    return (
        <div className="flex">
            <Navbar />
            <div>
                <Header />
                {/* blocks container */}
                <div>

                </div>
            </div>
        </div>
    )
}
export default Dashboard;