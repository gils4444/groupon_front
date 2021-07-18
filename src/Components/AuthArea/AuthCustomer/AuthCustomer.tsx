import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import "./AuthCustomer.css";

/**
 * Allows logging in as a customer
 * @returns 
 */
function AuthCustomer(): JSX.Element {

    let [user, setUser] = useState<UserModel>(store.getState().authState.user);

    
    // Subscribes to the store and gets the user details every time there is a change in the AuthState
    useEffect(() => {
    let unSubscribeMe = 
        store.subscribe(() => {
            setUser(store.getState().authState.user);
        })
        return function cleanup(){
            unSubscribeMe();
        };
    });

    return (
        <div className="AuthCustomer">
            {
                user && <>
                    <span>Hello {user.name}</span>
                    <span> | </span>
                    <NavLink to="/logout">Logout</NavLink>
                </>
            }
            {
                !user && <>
                    <span>Hello Guest</span>
                    <span> | </span>
                    <NavLink to="/login/customer">Login</NavLink>
                    <span> | </span>
                    <NavLink to="/admin/add/customer">Register</NavLink>
                </>
            }
        </div>
    );
}

export default AuthCustomer;
