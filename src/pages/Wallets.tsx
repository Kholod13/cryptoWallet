import AddWalletForm from '../components/wallets/AddWalletForm';
import WalletList from '../components/wallets/WalletList';
const Wallets = () => {

    return (
        <div className="flex flex-col gap-4">
            <WalletList/>
            <AddWalletForm/>
        </div>
    )
}
export default Wallets;