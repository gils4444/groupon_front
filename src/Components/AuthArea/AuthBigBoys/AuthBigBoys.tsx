import { NavLink } from "react-router-dom";
import "./AuthBigBoys.css";

/**
 * Allows logging in as an admin or company
 * @returns 
 */
function AuthBigBoys(): JSX.Element {
    return (
        <div className="AuthBigBoys">
            Log in as &nbsp;
		    <NavLink to="/login/admin">Admin</NavLink>
            &nbsp; | &nbsp;
		    <NavLink to="/login/company">Company</NavLink>
        </div>
    );
}

export default AuthBigBoys;
