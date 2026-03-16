import AddWalletForm from '../components/wallets/AddWalletForm';
import WalletList from '../components/wallets/WalletList';
import ApiNotice from "../components/wallets/ApiNotice.tsx";

const Wallets = () => {

    return (
        <div className="flex flex-col gap-4">
            <ApiNotice />
            <WalletList/>
            <AddWalletForm/>
        </div>
    )
}
export default Wallets;