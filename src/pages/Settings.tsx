import UserParams from '../components/settings/UserParams';
import Logout from '../components/settings/Logout';
import Contact from '../components/settings/Contact';
import {useAppSelector} from "../store";
import AppProperties from "../components/settings/AppProperties.tsx";

const Settings = () => {

    const userName = useAppSelector(state => state.user.username);

    return (
        <div className='flex flex-col gap-6'>
            <UserParams key={userName} />
            <div className='flex gap-6'>
                <AppProperties/>
                <Logout />
            </div>
            <Contact />
        </div>
    )
}
export default Settings;