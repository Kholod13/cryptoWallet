import {useAppDispatch, useAppSelector} from "../store";
import {addWallet, deleteWallet} from "../store/slices/arrayWalletsSlice.ts";
import {useState} from "react";

const Wallets = () => {
    //take wallets array
    const wallets = useAppSelector(state => state.wallets.list);

    //for add new wallet
    const dispatch = useAppDispatch();

    const onAdd = (name:string, address:string) => {
        dispatch(addWallet({
            id: crypto.randomUUID(),
            name: name,
            address: address,
        }))
        setName('')
        setAddress('')
    }
    const onDelete = (id:string) => {
        dispatch(deleteWallet(id));
    }

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    return (
        <div>
            <h1>Wallets</h1>
            <div>
                <label>Wallet name</label>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='border-2'/>
            </div>
            <div>
                <label>Wallet address</label>
                <input onChange={(e) => setAddress(e.target.value)} value={address} type="text" className='border-2'/>
            </div>
            <button
                className='bg-green-500'
                onClick={() => onAdd(name, address)}
            >Save</button>
            <br/>
            <div className="flex flex-col gap-3">
                {wallets.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-800 border border-slate-700 rounded-2xl flex justify-between items-center">
                        <div>
                            <p className="text-white font-bold">{item.name}</p>
                            <p className="text-slate-400 text-xs font-mono">{item.address}</p>
                        </div>
                        {/* Кнопка удаления, которую мы планировали в слайсе */}
                        <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Wallets;