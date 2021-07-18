import { Button } from "@material-ui/core";
import { Build } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companiesDownloadedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./UpdateCompany.css";

interface UpdateCompanyProps {
    company:CompanyModel;
	
}

/**
 * Displays all the companies and let you chose which company you want to update
 */
function UpdateCompany(props: UpdateCompanyProps): JSX.Element {


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


    let goToForm = (company: CompanyModel) => {
        history.push("/admin/update/company/" + company.id);
    }


    return (
        <div className="UpdateCompany Scroller">
			
            {companies.map((c) =>
                <CompanyCard myFunction={goToForm} children={<Build />} company={c} key={c.id} />
            )}

            <br />
            <br />
            <NavLink to="/administrator">
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>
        </div>
    );
}

export default UpdateCompany;
