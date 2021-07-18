import { NavLink, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import CredentialsModel from "../../../Models/CredentialsModel";
import "./Login.css";
import axios from "axios";
import UserModel, { ClientType } from "../../../Models/UserModel";
import globals from "../../../services/Globals";
import store from "../../../Redux/Store";
import { loginAction } from "../../../Redux/AuthState";
import { Button, FormControl, Input, InputLabel, makeStyles, IconButton } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Home, LockOpen } from "@material-ui/icons";
import notify from "../../../services/Notifications";
import { useState } from "react";

interface LoginProps {
    type: ClientType;
}

const useStyles = makeStyles({
    root: {
        position: "absolute",
        left: "80%",
        top: "12.5%",
        "&:hover": {
            backgroundColor: "transparent"
        }
    }
})
/**
 * Submit user credentials  to the server in order to validate user.
 * If validated , dispatches the details to the authState and transfers the user to his personal area 
 * @param props Client Type
 * @returns 
 */
function Login(props: LoginProps): JSX.Element {

    const classes = useStyles();

    let [passwordShown, setPasswordShown] = useState(false);

    let togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    let history = useHistory();//redirect to function

    let { register, handleSubmit } = useForm<CredentialsModel>();

    /**
     * get email & password from the form and user type from the props
     * and send it to the backend, there it will be validated
     * @param credentials 
     */
    async function send(credentials: CredentialsModel) {
        if (store.getState().authState.user) {
            notify.error("You are already logged in. Please logout first.")
        } else {
            try {
                //concatenates the email, password and the client type to a string (URL)
                let endUrl = "?email=" + credentials.email + "&password=" + credentials.password;

                switch (props.type) {
                    case ClientType.ADMINISTRATOR:
                        endUrl += "&type=" + ClientType.ADMINISTRATOR;
                        break;
                    case ClientType.COMPANY:
                        endUrl += "&type=" + ClientType.COMPANY;
                        break;
                    case ClientType.CUSTOMER:
                        endUrl += "&type=" + ClientType.CUSTOMER;
                        break;
                }
                // pass the data to the backend
                let response = await axios.post<UserModel>(globals.urls.login + endUrl, credentials);
                store.dispatch(loginAction(response.data))
                notify.success("you have been successfully logged in");
                history.push("/" + props.type.toString().toLowerCase());

            } catch (error) {
                notify.error(error)
            }
        }
    }

    /**
     * make each word began with capital letter
     * @param categoryName 
     * @returns string
     */
    function niceString(categoryName: string): string {
        categoryName = categoryName.toLowerCase();
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        categoryName = categoryName.replace('_', ' ')
        let words = categoryName.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    }

    return (
        <div className="Login ">

            <h2>Login as {niceString(props.type)}</h2>

            <form onSubmit={handleSubmit(send)}>


                <FormControl>
                    <InputLabel htmlFor="my-input">User email</InputLabel>
                    <Input id="email" type="email" aria-describedby="my-helper-text" {...register('email')} />
                </FormControl>
                <br /><br />
                <FormControl>
                    <InputLabel htmlFor="my-input">Password</InputLabel>
                    <Input id="password" type={passwordShown ? "text" : "password"} {...register('password')} />
                    <IconButton className={classes.root} onClick={togglePasswordVisiblity} >{<VisibilityIcon />}</IconButton>
                </FormControl>
                <br /><br />

                <Button type="submit" startIcon={<LockOpen />} style={{ textTransform: "none" }} variant="outlined">Login</Button>

            </form>

            <br />
            <br />
            <NavLink to="/home">
                <Button startIcon={<Home />} style={{ textTransform: "none" }} color="primary" variant="contained">Home</Button>
            </NavLink>

        </div>
    );
}

export default Login;
