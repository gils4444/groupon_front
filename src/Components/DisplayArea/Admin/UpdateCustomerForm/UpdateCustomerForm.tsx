import { Button, FormControl, makeStyles, Input, InputLabel, IconButton } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useEffect, useState } from "react";
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router";
import CustomerModel from "../../../../Models/CustomerModel";
import { customerUpdatedAction } from "../../../../Redux/CustomerState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import "./UpdateCustomerForm.css";
import { NavLink } from "react-router-dom";
import { ClientType } from "../../../../Models/UserModel";


interface RouteParams {
    id: string
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

interface UpdateCustomerFormProps extends RouteComponentProps<RouteParams> { }

/**
 * Displays a form to update the selected customer, only changed values will be updated.
 */
function UpdateCustomerForm(props: UpdateCustomerFormProps): JSX.Element {

    let { register, handleSubmit } = useForm<CustomerModel>();
    let history = useHistory();

    const classes = useStyles();

    let [passwordShown, setPasswordShown] = useState(false);

    let togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    let [customer, setCustomer] = useState<CustomerModel>(() =>
        store.getState().customerState.customers.find((c) => (
            c.id === parseInt(props.match.params.id))));

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please log in");
            history.push("/login/admin")
            // Insures a refresh does not crash the site by using a local storage
            // downloads from local storage
        } else if (customer === undefined) {
            let storageCustomer = localStorage.getItem("storage-customer");
            if (storageCustomer !== 'undefined' && storageCustomer !== 'null') {
                setCustomer(JSON.parse(storageCustomer));
            }
        } else {
            // sends to local storage
            localStorage.setItem("storage-customer", JSON.stringify(customer));
        }
    })

    /**
    * check if the values on the form are different from the original values,
    * if do then change original values.
    * @param customerToUpdate 
    */
    function checkChanges(customerToUpdate: CustomerModel) {
        if (!customerToUpdate.email) { customerToUpdate.email = customer.email }
        if (!customerToUpdate.firstName) { customerToUpdate.firstName = customer.firstName }
        if (!customerToUpdate.lastName) { customerToUpdate.lastName = customer.lastName }
        if (!customerToUpdate.password) { customerToUpdate.password = customer.password }
    }

    /**
   * sets the value of id  to the current value
   * and check if there is any change in the other values
   * and finally sends it to the backend.
   * @param companyToUpdate 
   */
    let handleUpdate = async (customerToUpdate: CustomerModel) => {
        try {
            customerToUpdate.id = customer.id;

            checkChanges(customerToUpdate);

            let response = await jwtAxios.put<CustomerModel>(globals.urls.updateCustomer, customerToUpdate);
            let updatedCustomer = response.data;
            console.log("updatedCustomer");
            console.log(updatedCustomer);
            store.dispatch(customerUpdatedAction(updatedCustomer));
            notify.success(updatedCustomer.firstName + " has been updated");
            history.push("/administrator")
        } catch (error) {
            notify.error(error)
        }
    }

    return (
        <div className="UpdateCustomerForm">
            {customer &&
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <br />
                    <FormControl>
                        <InputLabel>First Name</InputLabel>
                        <Input id="firstName" defaultValue={customer.firstName} type="text" {...register('firstName')} inputProps={{ minLength: 3, maxLength: 20 }} />
                    </FormControl>
                    <br />
                    <br />
                    <FormControl>
                        <InputLabel>Last Name</InputLabel>
                        <Input id="lastName" defaultValue={customer.lastName} type="text" {...register('lastName')} inputProps={{ minLength: 3, maxLength: 20 }} />
                    </FormControl>
                    <br />
                    <br />
                    <FormControl>
                        <InputLabel>Email address</InputLabel>
                        <Input id="email" defaultValue={customer.email} type="email" {...register('email')} />
                    </FormControl>
                    <br />
                    <br />
                    <FormControl>
                        <InputLabel >Customer password</InputLabel>
                        <Input id="password" defaultValue={customer.password} type={passwordShown ? "text" : "password"} {...register('password')} inputProps={{ minLength: 3, maxLength: 15 }} />
                        <IconButton className={classes.root} onClick={togglePasswordVisiblity} >{<VisibilityIcon />}</IconButton>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="contained" color="primary" size="large" type="submit" startIcon={<SaveIcon />}> save</Button>
                </form>
            }
            <br />
            <br />
            <br />
            <NavLink to="/administrator">
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>

        </div>
    );
}

export default UpdateCustomerForm;
