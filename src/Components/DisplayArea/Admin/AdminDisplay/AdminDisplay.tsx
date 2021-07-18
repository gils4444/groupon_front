import { Button } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { companiesDownloadedAction } from "../../../../Redux/CompanyState";
import { customersDownloadedAction } from "../../../../Redux/CustomerState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import OperationCard from "../../OperationCard/OperationCard";
import "./AdminDisplay.css";

/**
 * Displays the available operation for the admin
 */
function AdminDisplay(): JSX.Element {

    let history = useHistory();
    let [compsAndCustsFetched,setCompsAndCustsFetched]= useState<boolean>(false);

    /**
     * gets the companies from the DB and dispatches it to the store
     */
    async function getCompanies() {
        try {
            let response = await jwtAxios.get<CompanyModel[]>(globals.urls.getAllCompanies);
            store.dispatch(companiesDownloadedAction(response.data));
        } catch (error) {
            notify.error(error);
        }
    }
    
    /**
     * gets the customers from the DB and dispatches it to the store
     */
    async function getCustomers() {
        try {
            let response = await jwtAxios.get<CustomerModel[]>(globals.urls.getAllCustomers);
            store.dispatch(customersDownloadedAction(response.data));
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {
        //if we don't have a user object er are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please login")
            history.push("/login/admin");
        } 
        //gets the companies and the customers for the first time
        else if (!compsAndCustsFetched) {
                getCompanies();
                getCustomers();
                setCompsAndCustsFetched(true);
            }
        
    }, []);

    return (
        <div className="AdminDisplay">
            {/* company */}
            <NavLink to="/admin/add/company"><OperationCard operation="Add Company" /></NavLink>
            <NavLink to="/admin/update/company"><OperationCard operation="Update Company" /></NavLink>
            <NavLink to="/admin/delete/company"><OperationCard operation="Delete Company" /></NavLink>
            <br />
            <hr className="hr"/>
            {/* customer */}
            <NavLink to="/admin/add/customer"><OperationCard operation="Add Customer" /></NavLink>
            <NavLink to="/admin/update/customer"><OperationCard operation="Update Customer" /></NavLink>
            <NavLink to="/admin/delete/customer"><OperationCard operation="Delete Customer" /></NavLink>
            <br />
            <br />
            <br />
            <NavLink to="/home">
                <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="outlined">Home</Button>
            </NavLink>

        </div>
    );
}

export default AdminDisplay;
