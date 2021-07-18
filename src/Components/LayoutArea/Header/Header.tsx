import { Component } from "react";
import "./Header.css";
import AuthCustomer from "../../AuthArea/AuthCustomer/AuthCustomer";
import MyArea from "../../DisplayArea/MyArea/MyArea";

class Header extends Component {

    public render(): JSX.Element {
        return (
            <div className="Header">
                <span className="Login">
                    <AuthCustomer />
                </span>
                <span className="MyArea">
                    <MyArea/>
                </span>
            </div>
        );
    }
}

export default Header;
