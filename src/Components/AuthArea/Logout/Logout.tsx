import { useEffect } from "react";
import { useHistory } from "react-router";
import { logoutAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../services/Notifications";

/**
 * logout the user and dispatches the store accordingly
 */
function Logout(): JSX.Element {
   
    const history = useHistory();

    useEffect(()=>{
        store.dispatch(logoutAction());
        notify.success("you are now logged out.");
        history.push("/home");
    });

    return null;
}

export default Logout;
