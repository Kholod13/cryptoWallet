import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

//interface for 1 wallet
interface Wallet {
    id: string;
    name: string;
    address: string;
}

//interface for array wallets | all storage
interface WalletState {
    list: Wallet[];
}

const savedWallets = localStorage.getItem("user_wallets");

const initialState: WalletState = {
    //Если в памяти есть данные берем их если нет = пустой массив
    list: savedWallets ? JSON.parse(savedWallets) : []
}

const walletSlice = createSlice({
    name: 'wallets',
    initialState,
    reducers: {
        //function for ADD
        addWallet: (state, action: PayloadAction<Wallet>) => {
            //push to array
            state.list.push(action.payload);

            //save updated array to local storage
            localStorage.setItem("user_wallets", JSON.stringify(state.list));
        },

        //function for DELETING
        deleteWallet: (state, action: PayloadAction<string>) => {
            //filter array without deleted wallet
            state.list = state.list.filter(wallet => wallet.id !== action.payload);

            //update browser memory
            localStorage.setItem("user_wallets", JSON.stringify(state.list));
        },
    }
})

//export reducers for actions(buttons)
export const {addWallet, deleteWallet} = walletSlice.actions;

//export this one slice for global Store (../store)
export default walletSlice.reducer;