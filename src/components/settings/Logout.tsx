import { SquareArrowOutUpRight } from 'lucide-react';
import {useAppDispatch} from "../../store";
import {logoutUser} from '../../store/slices/userSlice.ts';
import {NavLink} from 'react-router-dom';

export const Logout = () => {
    const dispatch = useAppDispatch();

    return (
        <NavLink to={'/dashboard'} onClick={() => dispatch(logoutUser())}
        className='inline-block text-center text-white font-bold rounded-xl cursor-pointer flex-col bg-[#362F5E] p-9
        hover:bg-[#4a4080] transition-colors'>
            <SquareArrowOutUpRight color='white' size={80}/>
            <p>Log Out</p>
        </NavLink>
    )
}

export default Logout;