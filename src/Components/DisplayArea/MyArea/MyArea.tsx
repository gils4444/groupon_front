import { Button } from "@material-ui/core";
import { AccountBox } from "@material-ui/icons";
import { useHistory } from "react-router";
import store from "../../../Redux/Store";
import notify from "../../../services/Notifications";
import "./MyArea.css";

function MyArea(): JSX.Element {

    let history = useHistory();

    /**
     * chack if the user is looged in and if do, then send it to his own area.(depending on his client type)
     */
    function isLoggedIn() {
        if (!store.getState().authState.user) {
            notify.error("please log in")
            history.push("/home");
        } else {
            history.push("/" + store.getState().authState.user.clientType.toString().toLowerCase());
        }
    };

    return (
        <div className="MyArea">
            <Button color="primary" onClick={isLoggedIn} startIcon={<AccountBox />} style={{ textTransform: "none" }} variant="outlined">My Area</Button>
        </div>
    );
}

export default MyArea;
