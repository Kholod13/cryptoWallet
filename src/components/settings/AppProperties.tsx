import { Languages, Palette, DollarSign } from 'lucide-react';

export const AppProperties = () => {
    return (
        <div className='flex gap-4 h-max'>
            <div className='inline-block text-center text-white font-bold rounded-xl cursor-pointer flex-col bg-black
                p-9 hover:bg-gray-700 transition-colors'
            >
                <Languages size={60}/>
            </div>
            <div className='inline-block text-center text-white font-bold rounded-xl cursor-pointer flex-col bg-black
                p-9 hover:bg-gray-700 transition-colors'
            >
                <Palette size={60}/>
            </div>
            <div className='inline-block text-center text-white font-bold rounded-xl cursor-pointer flex-col bg-black
                p-9 hover:bg-gray-700 transition-colors'
            >
                <DollarSign size={60}/>
            </div>
        </div>
    )
}

export default AppProperties;