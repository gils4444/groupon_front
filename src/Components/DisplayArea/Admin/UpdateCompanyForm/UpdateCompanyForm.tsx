import { Button, FormControl, FormHelperText, IconButton, Input, InputLabel, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companyUpdatedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import SaveIcon from '@material-ui/icons/Save';
import VisibilityIcon from '@material-ui/icons/Visibility';
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import "./UpdateCompanyForm.css";

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

interface RouteParams {
    id: string
}

/**
 * Displays a form to update the selected company, only changed values will be updated.
 */
interface UpdateCompanyFormProps extends RouteComponentProps<RouteParams> { }

function UpdateCompanyForm(props: UpdateCompanyFormProps): JSX.Element {

    const classes = useStyles();

    let [passwordShown, setPasswordShown] = useState(false);

    let { register, handleSubmit, setValue } = useForm<CompanyModel>();
    let history = useHistory();
    let [company, setCompany] = useState<CompanyModel>(() =>
        store.getState().companyState.companies.find((c) => (
            c.id === parseInt(props.match.params.id))));

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    /**
     * check if the values on the form are different from the original values,
     * if do then change original values.
     * @param companyToUpdate 
     */
    const checkChanges = (companyToUpdate: CompanyModel) => {
        if (!companyToUpdate.email) { companyToUpdate.email = company.email }
        if (!companyToUpdate.password) { companyToUpdate.password = company.password }
    }

    /**
     * sets the values of id and name to the current values 
     * and check if there is any change in the other values
     * and finally sends it to the backend.
     * @param companyToUpdate 
     */
    const handleUpdate = async (companyToUpdate: CompanyModel) => {
        try {

            companyToUpdate.id = company.id;
            companyToUpdate.name = company.name;

            checkChanges(companyToUpdate);

            let response = await jwtAxios.put<CompanyModel>(globals.urls.updateCompany, companyToUpdate);
            let updatedCompany = response.data;
            store.dispatch(companyUpdatedAction(updatedCompany));
            notify.success("Company " + company.name + " has been updated updated")
            history.push("/administrator")
        } catch (error) {
            notify.error(error)
        }
    }
    useEffect(() => {
        // let company: CompanyModel;
        
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please login")
            history.push("/login/admin");
            // Insures a refresh does not crash the site by using a local storage
        } else if (company === undefined) {
            //      downloads from local storage
            let storageCompany = localStorage.getItem("storage-company");
            if (storageCompany !== 'undefined' && storageCompany !== 'null') {
                setCompany(JSON.parse(storageCompany));
                console.log("3 " + company);
            }
        } else {
            // sends to local storage
            localStorage.setItem("storage-company", JSON.stringify(company));
        }

    })

    return (
        <div className="UpdateCompanyForm">
            {company &&
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <br />
                    <FormControl>
                        <InputLabel>Email address</InputLabel>
                        <Input id="email" defaultValue={company.email} type="email" {...register('email')} />
                        <FormHelperText id="my-helper-text">
                            Current email: {company.email}
                        </FormHelperText>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl>
                        <InputLabel>Company password</InputLabel>
                        <Input id="password" defaultValue={company.password} type={passwordShown ? "text" : "password"} {...register('password')} inputProps={{ minLength: 3, maxLength: 15 }} />
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

export default UpdateCompanyForm;
