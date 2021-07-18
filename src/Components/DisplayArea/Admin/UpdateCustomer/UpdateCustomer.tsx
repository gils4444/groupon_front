import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Build } from "@material-ui/icons";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { customersDownloadedAction } from "../../../../Redux/CustomerState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./UpdateCustomer.css";

interface UpdateCustomerProps {
    customer: CustomerModel;
}

/**
 * Displays all the customers and let you chose which customer you want to update
 */
function UpdateCustomer(props: UpdateCustomerProps): JSX.Element {


    let [customers, setCustomers] = useState<CustomerModel[]>(store.getState().customerState.customers);

    let history = useHistory();

    //gets the customers from the DB and dispatches it to the store 
    async function getCustomers() {
        try {
            let response = await jwtAxios.get<CustomerModel[]>(globals.urls.getAllCustomers);
            store.dispatch(customersDownloadedAction(response.data));
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {

        let unSubscribeMe = store.subscribe(() => {
            setCustomers(store.getState().customerState.customers);
        })
        //if we don't have a user object er are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please login")
            history.push("/login/admin");
        }
          // if customerState.customers is empty get the list of customers
        else if (store.getState().customerState.customers.length === 0) {
            getCustomers();
        }
        return function cleanup() {
            unSubscribeMe();
        }
    }, []);

    let goToForm = (customer: CustomerModel) => {
        history.push("/admin/update/customer/" + customer.id);
    }

    return (
        <div className="UpdateCustomer Scroller">

            {customers.map((c) =>
                <CustomerCard myFunction={goToForm} children={<Build />} customer={c} key={c.id} />
            )}

            <br />
            <br />
            <NavLink to="/administrator">
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>

        </div>
    );
}

export default UpdateCustomer;
