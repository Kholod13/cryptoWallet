import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

const Wallets = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {setTitle}: string = useOutletContext();

    useEffect(() => {
        setTitle("Wallets");
    }, []);

    return (
        <div>
            <h1>Wallets</h1>
        </div>
    )
}
export default Wallets;