import { Button, Typography } from "@material-ui/core";
import React, { Component } from "react";
import axios from "axios";
import CouponModel from "../../../Models/CouponModel";
import store from "../../../Redux/Store";
import { RouteComponentProps } from "react-router";
import globals from "../../../services/Globals";
import CouponCard from "../CouponCard/CouponCard";
import { NavLink } from "react-router-dom";
import "./CategoryCoupons.css";
import { Home } from "@material-ui/icons";
import { couponAddedAction } from "../../../Redux/CouponsState";

interface CategoryCouponsState {
    coupons: CouponModel[];

}
/**
 * The parameter passed by from the parent component via routing 
 */
interface RouteParams {
    category: string;
}

interface CategoryCouponsProps extends RouteComponentProps<RouteParams> { }

/**
 * displays all coupons from a given category
 */
class CategoryCoupons extends Component<CategoryCouponsProps, CategoryCouponsState> {

    public async componentDidMount() {
        try {
            let category = this.props.match.params.category.toString();
            let response = await axios.get<CouponModel[]>(globals.urls.categoryCoupons + category);
            response.data.forEach((c) => (
                store.dispatch(couponAddedAction(c))
            ))
            this.setState({ coupons: response.data });
        } catch (error) {
            console.log(error.message);

        }
    }


    public constructor(props: CategoryCouponsProps) {
        super(props);
        this.state = { coupons: null };
    }

    public render(): JSX.Element {
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

        return (
            <div className="CategoryCoupons Scroller">
                <div >
                    <Typography variant="h4">{niceString(this.props.match.params.category.toString())} </Typography>
                    <br /><br />
                    {/* displays coupons with amount greater than 0  */}
                    {this.state.coupons?.filter((c) => c.amount > 0).map(c => <CouponCard key={c.id} coupon={c} />)}
                    <br />
                    <br />

                </div>
                <NavLink to="/home">
                    <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="outlined">Home</Button>
                </NavLink>

            </div >
        );
    }
}

export default CategoryCoupons;
