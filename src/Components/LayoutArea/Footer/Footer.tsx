import { Component } from "react";
import { Typography } from "@material-ui/core";
import "./Footer.css";
import AuthBigBoys from "../../AuthArea/AuthBigBoys/AuthBigBoys";

class Footer extends Component {

    public render(): JSX.Element {
        return (
            <div className="Footer">
                <span>
                    <AuthBigBoys />
                </span>
                <Typography className="copy" variant="subtitle2">&copy; Gil Sharon</Typography>
            </div>
        );
    }
}

export default Footer;
