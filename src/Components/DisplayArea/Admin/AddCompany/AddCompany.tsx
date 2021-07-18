import "./AddCompany.css";
import { Button, FormControl, FormHelperText, Input, InputLabel, IconButton, makeStyles } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import store from "../../../../Redux/Store";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ClientType } from "../../../../Models/UserModel";
import SaveIcon from '@material-ui/icons/Save';
import CompanyModel from "../../../../Models/CompanyModel";
import { useForm } from "react-hook-form";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import { NavLink } from "react-router-dom";
import notify from "../../../../services/Notifications";
import { companyAddedAction } from "../../../../Redux/CompanyState";

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
 *Displays a form to the admin to add a new company to the site.
 */
function AddCompany(): JSX.Element {

    let { register, handleSubmit } = useForm<CompanyModel>();
    let history = useHistory();

    const classes = useStyles();

    let [passwordShown, setPasswordShown] = useState(false);


    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    useEffect(() => {
        //if we don't have a user object or are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please login")
            history.push("/login/admin");
        }
    });

    /**
     * Receives the company data from the form. The function then sends the company
     * as FormData to the server.
     */
    async function send(company: CompanyModel) {
        try {
            let response = await jwtAxios.post<CompanyModel>(globals.urls.addCompany, company);
            const addedCompany = response.data;
            store.dispatch(companyAddedAction(addedCompany));

            notify.success(addedCompany.name + " company added")
            history.push("/administrator");
        } catch (error) {
            notify.error(error);

        }
    }


    return (
        <div className="AddCompany ">
            <form onSubmit={handleSubmit(send)}>
                <FormControl>
                    <InputLabel>Company name</InputLabel>
                    <Input id="name" required type="text"  {...register('name')} inputProps={{ minLength: 3, maxLength: 25 }} />
                </FormControl>
                <br />
                <br />
                <FormControl>
                    <InputLabel >Email address</InputLabel>
                    <Input id="email" required type="email"  {...register('email')} />
                </FormControl>
                <br />
                <br />
                <FormControl>
                    <InputLabel>Company password</InputLabel>
                    <Input id="password" required type={passwordShown ? "text" : "password"} {...register('password')} inputProps={{ minLength: 3, maxLength: 15 }} />
                    <IconButton className={classes.root} onClick={togglePasswordVisiblity} >{<VisibilityIcon />}</IconButton>
                    <FormHelperText >We'll never share the password.</FormHelperText>
                </FormControl>
                <br />
                <br />
                <Button variant="contained" color="primary" size="large" type="submit" startIcon={<SaveIcon />}> save</Button>
            </form>

            <br />
            <br />
            <br />
            <NavLink to="/administrator">
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>
        </div>
    );
}

export default AddCompany;
