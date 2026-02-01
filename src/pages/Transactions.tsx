import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

const Transactions = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {setTitle}: string = useOutletContext();

    useEffect(() => {
        setTitle("Transactions");
    }, []);

    return (
        <div>
            <h1>Transactions</h1>
        </div>
    )
}
export default Transactions;