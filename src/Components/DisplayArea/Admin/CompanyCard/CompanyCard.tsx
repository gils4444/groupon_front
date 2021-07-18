import { Card, CardHeader, IconButton } from "@material-ui/core";
import { ReactNode } from "react";
import CompanyModel from "../../../../Models/CompanyModel";
import "./CompanyCard.css";

interface CompanyCardProps {
    company: CompanyModel;
    children: ReactNode;
    myFunction: Function;
}

/**
 * this card show details about the given company
 */
function CompanyCard(props: CompanyCardProps): JSX.Element {
    return (
        <div className="CompanyCard">
            <Card key={props.company.id} >
                <CardHeader action={
                    <IconButton onClick={() => props.myFunction(props.company)
                    }> {props.children} </IconButton>
                }
                    title={props.company.name}
                    subheader={"Contact info: " + props.company.email} />
            </Card>

        </div>
    );
}

export default CompanyCard;
