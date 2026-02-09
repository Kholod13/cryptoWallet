import {Handshake} from 'lucide-react';

export const Contact = () => {
    return (
        <div
            className='flex justify-center items-center text-sm text-center text-wrap text-white font-bold rounded-xl flex-col bg-gray-600 p-9 h-max w-max'
        >
            <Handshake size={100}/>
            <p className='text-xl pb-3'>Contact with<br/>developer</p>
            <p><span>Telegram:</span> kah13x</p>
            <p><span>Email:</span> vlad13holod@gmail.com</p>
        </div>
    )
}

export default Contact;