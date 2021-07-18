import { Button, makeStyles, InputLabel, FormControl, MenuItem, Input, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Home } from "@material-ui/icons";
import "./CustomerDisplay.css";
import store from "../../../../Redux/Store";
import jwtAxios from "../../../../services/JwtAxios";
import globals from "../../../../services/Globals";
import notify from "../../../../services/Notifications";
import { ClientType } from "../../../../Models/UserModel";
import CouponCard from "../../../CouponsArea/CouponCard/CouponCard";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import { useForm } from "react-hook-form";
import CustomerModel from "../../../../Models/CustomerModel";
import { customerAddedAction } from "../../../../Redux/CustomerState";
import { couponAddedAction } from "../../../../Redux/CouponsState";


const useStyles = makeStyles((theme) => ({
    dates: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))

/**
 * Displays the coupons bought by the customer
 */
function CustomerDisplay(): JSX.Element {
    type formDetails = { category: Category, maxPrice: number }

    const classes = useStyles();

    let history = useHistory();
    let [customerFetched, setCustomerFetched] = useState<boolean>(false);
    let [customer, setCustomer] = useState<CustomerModel>();
    let [details, setDetails] = useState<formDetails>(null);
    const [categoryValue, setCategoryValue] = useState(null);
    const [priceValue, setPriceValue] = useState(null);

    let { register, handleSubmit } = useForm<formDetails>();


    /**
     * gets the customer details from the DB, sets the customer state, coupons and dispatches it to the store.
     * 
     */
    async function getCustomer() {
        try {
            let response = await jwtAxios.get<CustomerModel>(globals.urls.getCustomerDetails);
            setCustomer(response.data)
            store.dispatch(customerAddedAction(response.data));
            customer?.coupons.forEach(coupon =>
                store.dispatch(couponAddedAction(coupon))
            )
            setCustomerFetched(true); //insure that we make only one request to the server(to get the customer)
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.CUSTOMER) {
            notify.error("Please login")
            history.push("/login/customer");
        }
        else if (!customerFetched) {
            getCustomer();
        }
    }, [customer]);

    const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategoryValue(event.target.value as Category);
    };
    const handleChangePrice = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPriceValue(event.target.value as number);
    };

    function send(details: formDetails) {
        setDetails(details);
    }

    const clearSelection = () => {
        setCategoryValue(null);
        setPriceValue(null);
        setDetails(null);
    }

    /**
     * Filters the coupons based on category & price
     * @returns CouponModel[]
     */
    const showCoupons = (): CouponModel[] => {
        let myCoupons = customer.coupons;
        if (details?.category !== undefined && details?.maxPrice !== undefined) {
            myCoupons = customer.coupons.filter((c) =>
                (c.price <= details.maxPrice && c.category === details.category));
        }
        return myCoupons;
    }

    return (
        <div className="CustomerDisplay Scroller">
            <NavLink className="homeButton" to="/home">
                <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="outlined">Home</Button>
            </NavLink>
            <br />


            <form className="mySearch" onSubmit={handleSubmit(send)}>
                <FormControl className={classes.dates}>
                    <InputLabel>Coupon category</InputLabel>
                    <Select required {...register('category')} labelId="labelIdCategories" id="categoriesId" value={!categoryValue ? "" : categoryValue} onChange={handleChangeCategory}>
                        <MenuItem value={null} >-</MenuItem>
                        <MenuItem value={Category.FOOD} >Food</MenuItem>
                        <MenuItem value={Category.ELECTRICITY} >Electricity</MenuItem>
                        <MenuItem value={Category.RESTAURANT} >Restaurant</MenuItem>
                        <MenuItem value={Category.VACATION} >Vacation</MenuItem>
                    </Select>
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel >Coupon price</InputLabel>
                    <Input required id="price" type="number" value={!priceValue ? "" : priceValue} {...register('maxPrice')} onChange={handleChangePrice} />
                </FormControl>

                <br />
                <Button variant="contained" color="primary" size="small" type="submit" startIcon={<SearchIcon />}> Search</Button>
                &nbsp;
                <Button variant="contained" size="small" onClick={clearSelection} startIcon={<DeleteIcon />}> Clear</Button>
            </form>


            {customer?.coupons && showCoupons().map((c) =>
                <CouponCard key={c.id} coupon={c} />
            )}
            <br />
        </div>
    );
}

export default CustomerDisplay;
