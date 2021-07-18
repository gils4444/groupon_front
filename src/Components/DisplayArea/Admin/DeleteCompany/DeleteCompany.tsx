import { Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companiesDownloadedAction, companyDeletedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./DeleteCompany.css";


/**
 * Displays all the companies and let you chose which company you want to delete
 */
function DeleteCompany(): JSX.Element {

    let [companies, setCompanies] = useState<CompanyModel[]>(store.getState().companyState.companies);

    let history = useHistory();

    //gets the companies from the DB and dispatches it to the store 
    async function getCompanies() {
        try {
            let response = await jwtAxios.get<CompanyModel[]>(globals.urls.getAllCompanies);
            store.dispatch(companiesDownloadedAction(response.data));
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {

        let unSubscribeMe = store.subscribe(() => {
            setCompanies(store.getState().companyState.companies);
        })
        //if we don't have a user object er are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please login")
            history.push("/login/admin");
        }
        // if companyState.companies is empty get the list of companies
        else if (store.getState().companyState.companies.length === 0) {
            getCompanies();
        }
        return function cleanup() {
            unSubscribeMe();
        }
    }, []);


    // delete function: 
    /**
     * Passed on to the company card.
     * Deletes the company from the DB and update the store
     */
    let handleDelete = async (company: CompanyModel) => {
        try {
            await jwtAxios.delete<number>(globals.urls.deleteCompany + company.id);
            console.log(company.id);
            console.log(company.name);
            store.dispatch(companyDeletedAction(company.id));
            notify.success("Company " + company.name + " deleted.");
            history.push("/admin/delete/company")
        } catch (error) {
            notify.error(error);
        }

    }

    return (
        <div className="DeleteCompany Scroller">

            {companies.map((c) =>
                <CompanyCard myFunction={handleDelete} children={<Delete />} company={c} key={c.id} />
            )}

            <br />
            <br />
            <NavLink to="/administrator">
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>
        </div>
    );
}

export default DeleteCompany;






