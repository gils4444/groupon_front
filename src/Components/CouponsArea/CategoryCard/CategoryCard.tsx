import { ReactNode } from "react";
import { Card, CardHeader } from "@material-ui/core";
import CouponModel, { Category } from "../../../Models/CouponModel";
import { ClientType } from "../../../Models/UserModel";
import store from "../../../Redux/Store";

import "./CategoryCard.css";

interface CategoryCardProps {
    category: Category;
    children: ReactNode;
}

/**
 * Displays a crad according to the category
 * @param props 
 * @returns 
 */
function CategoryCard(props: CategoryCardProps): JSX.Element {

     /**
     * make each word began with capital letter
     * @param categoryName 
     * @returns string
     */
    function niceString(categoryName: string): string {
        categoryName = categoryName.toLowerCase();
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        categoryName = categoryName.replace('_', ' ')
        let words = categoryName.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    }

    function hey(): CouponModel[] {
        if (store.getState().authState.user?.clientType === ClientType.CUSTOMER) {
            let usr = store.getState().authState.user;
            let currentUser = store.getState().customerState.customers.find(c => c.id === usr.id)
            if (currentUser !== undefined)
                return currentUser.coupons;
            return [];
        }
    }
    return (
        <div className="CategoryCard ">

            <Card style={{backgroundColor: "Gold"}}>
                <CardHeader title={props.children} subheader={niceString(props.category)} />
            </Card>

        </div>
    );
}

export default CategoryCard;
