import { Card, CardHeader, IconButton } from "@material-ui/core";
import { ReactNode } from "react";
import CustomerModel from "../../../../Models/CustomerModel";
import "./CustomerCard.css";

interface CustomerCardProps {
    customer: CustomerModel;
    children: ReactNode;
    myFunction: Function;
}

/**
 * this card show details about the given customer
 */
function CustomerCard(props: CustomerCardProps): JSX.Element {
    return (
        <div className="CustomerCard">

            <Card key={props.customer.id} >
                <CardHeader action={
                    <IconButton onClick={() => props.myFunction(props.customer)
                    }> {props.children} </IconButton>
                }
                    title={props.customer.firstName+" "+props.customer.lastName}
                    subheader={"Contact info: " + props.customer.email} />
            </Card>

        </div>
    );
}

export default CustomerCard;
