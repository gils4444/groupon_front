import { Button, FormControl, FormHelperText, Input, InputLabel,makeStyles,IconButton } from "@material-ui/core";
import { useEffect, useState  } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import SaveIcon from '@material-ui/icons/Save';
import VisibilityIcon from '@material-ui/icons/Visibility';
import notify from "../../../../services/Notifications";
import "./AddCustomer.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles({
    root:{
        position: "absolute",
        left:"80%",
        top: "15%",
        "&:hover":{
            backgroundColor:"transparent"
        }
    }
})

/**
 *Displays a form to the admin to add a new customer to the site.
 */
function AddCustomer(): JSX.Element {

    let { register, handleSubmit } = useForm<CustomerModel>();
    let history = useHistory();

    const classes = useStyles();

    let [passwordShown, setPasswordShown] = useState(false);

    let togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };


    let userType = store.getState().authState.user?.clientType;
    useEffect(() => {
        //if we don't have a user object or are not logged in
        if (userType === ClientType.COMPANY || userType === ClientType.CUSTOMER) {
            notify.error("Please login")
            history.push("/login/admin");
        }
    });

    /**
     * Receives the customer data from the form. The function then sends the customer
     * as FormData to the server.
     */
    async function send(customer: CustomerModel) {
        try {
            let response;
            if (userType === ClientType.ADMINISTRATOR) {
                response = await jwtAxios.post<CustomerModel>(globals.urls.addCustomer, customer);
                history.push("/administrator");
            } else {
                response = await axios.post<CustomerModel>(globals.urls.addCustomerAsGuest, customer);
                history.push("/login/customer");

            }
            notify.success("customer: " + response.data.firstName + " " + response.data.lastName + " added")
        } catch (error) {
            notify.error(error);

        }
    }

    return (
        <div className="AddCustomer">
                <form onSubmit={handleSubmit(send)}>
                    <FormControl>
                        <InputLabel >Customer First Name</InputLabel>
                        <Input id="firstName" type="text" required {...register('firstName')} inputProps={{minLength:3,maxLength:20}} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Customer Last Name</InputLabel>
                        <Input id="lastName" type="text" required {...register('lastName')} inputProps={{minLength:3,maxLength:20}}/>
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Email Address</InputLabel>
                        <Input id="email" type="email" required {...register('email')} />
                        <FormHelperText >example@example.com</FormHelperText>
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Customer Password</InputLabel>
                        <Input id="password" type={passwordShown ? "text" : "password"} required {...register('password')} inputProps={{minLength:3,maxLength:15}} />
                        <IconButton className={classes.root} onClick={togglePasswordVisiblity} >{<VisibilityIcon/>}</IconButton>
                        <FormHelperText >We'll never share the password.</FormHelperText>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="contained" color="primary" size="large" type="submit" startIcon={<SaveIcon />}> save</Button>
                </form>

            <br />  
            <br />
            <NavLink to={store.getState().authState.user?.clientType=== ClientType.ADMINISTRATOR? "/administrator":"/home"}>
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>
        </div>
    );
}

export default AddCustomer;
