import UserParams from '../components/settings/UserParams';
import Logout from '../components/settings/Logout';
import {useAppSelector} from "../store";

const Settings = () => {

    const userName = useAppSelector(state => state.user.username);

    return (
        <div className='flex flex-col gap-6'>
            <UserParams key={userName} />
            <div className='flex'>
                <Logout />
            </div>
        </div>
    )
}
export default Settings;