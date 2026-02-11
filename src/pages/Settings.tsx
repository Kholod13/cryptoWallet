import UserParams from '../components/settings/UserParams';
import Logout from '../components/settings/Logout';
import Contact from '../components/settings/Contact';
import {useAppSelector} from "../store";
import AppProperties from "../components/settings/AppProperties.tsx";

const Settings = () => {

    const userName = useAppSelector(state => state.user.username);

    return (
        <div className='flex flex-col gap-8'>
            <UserParams key={userName} />
            <div className='flex gap-6'>
                <Contact />
                <AppProperties/>
                <Logout />
            </div>
        </div>
    )
}
export default Settings;