import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

const Settings = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {setTitle}: string = useOutletContext();

    useEffect(() => {
        setTitle("Settings");
    }, []);

    return (
        <div>
            <h1>Settings</h1>
        </div>
    )
}
export default Settings;