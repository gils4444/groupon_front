import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useHistory } from "react-router";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { customerDeletedAction, customersDownloadedAction } from "../../../../Redux/CustomerState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./DeleteCustomer.css";
import { NavLink } from "react-router-dom";

/**
 * Displays all the customers and let you chose which company you want to delete
 */
function DeleteCustomer(): JSX.Element {

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
         // if customerState.customers is empty get the list of companies
        else if (store.getState().customerState.customers.length === 0) {
            getCustomers();
        }
        return function cleanup() {
            unSubscribeMe();
        }
    }, []);

    // delete function: 
    /**
     * Passed on to the customer card.
     * Deletes the customer from the DB and update the store
     */
    let handleDelete = async (customer: CustomerModel) => {
        try {
            await jwtAxios.delete<number>(globals.urls.deleteCustomer + customer.id);
            store.dispatch(customerDeletedAction(customer.id));
            notify.success("Customer " + customer.firstName + " deleted.");
            history.push("/admin/delete/customer")
        } catch (error) {
            notify.error(error);
        }

    }

    return (
        <div className="DeleteCustomer Scroller">
            {customers.map((c) =>
                <CustomerCard myFunction={handleDelete} children={<Delete />} customer={c} key={c.id} />
            )}

            <br />
            <br />
            <NavLink to="/administrator">
                <Button variant="contained" color="primary"  > Back</Button>
            </NavLink>

        </div>
    );
}

export default DeleteCustomer;
