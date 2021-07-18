import { Power, Restaurant, CardTravelTwoTone, FastfoodTwoTone } from "@material-ui/icons";
import { Component } from "react";
import { Category } from "../../../Models/CouponModel";
import { NavLink } from "react-router-dom";
import CategoryCard from "../../CouponsArea/CategoryCard/CategoryCard";
import "./Home.css";

class Home extends Component {

    public render(): JSX.Element {
        return (
            <div className="Home Scroller">
                <NavLink to={"/coupons/category/" + Category.ELECTRICITY} exact>
                    <CategoryCard category={Category.ELECTRICITY}>
                        <Power />
                    </CategoryCard>
                </NavLink>
                <NavLink to={"/coupons/category/" + Category.FOOD} exact>
                    <CategoryCard category={Category.FOOD}>
                        <FastfoodTwoTone />
                    </CategoryCard>
                </NavLink>
                <NavLink to={"/coupons/category/" + Category.RESTAURANT} exact>
                    <CategoryCard category={Category.RESTAURANT}>
                        <Restaurant />
                    </CategoryCard>
                </NavLink>
                <NavLink to={"/coupons/category/" + Category.VACATION} exact>
                    <CategoryCard category={Category.VACATION}>
                        <CardTravelTwoTone />
                    </CategoryCard>
                </NavLink>
            </div>
        );
    }
}

export default Home;
