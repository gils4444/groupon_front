import { Button, makeStyles, InputLabel, FormControl, MenuItem, Input, Select } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { couponDeletedAction, couponsDownloadedAction } from "../../../../Redux/CouponsState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import CouponCard from "../../../CouponsArea/CouponCard/CouponCard";
import OperationCard from "../../OperationCard/OperationCard";
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import "./CompanyDisplay.css";

const useStyles = makeStyles((theme) => ({
    dates: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))

/**
 * Displays the company coupons and the available operation for each coupon
 */
function CompanyDisplay(): JSX.Element {

    type formDetails = { category: Category, maxPrice: number }
    let [details, setDetails] = useState<formDetails>(null);

    const classes = useStyles();
    let history = useHistory();
    let [coupons, setCoupons] = useState<CouponModel[]>();

    let [couponsFetched, setCouponsFetched] = useState<boolean>(false);

    let [categoryValue, setCategoryValue] = useState(null);
    let [priceValue, setPriceValue] = useState(null);

    let { register, handleSubmit } = useForm<formDetails>();

    //gets the coupons from the DB and dispatches it to the store
    //set the CouponsFetched to true to insure that the func works only 1 time at the first render
    async function getCoupons() {
        try {
            let response = await jwtAxios.get<CouponModel[]>(globals.urls.getAllCoupons);
            store.dispatch(couponsDownloadedAction(response.data));
            setCouponsFetched(true);
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {
        let unSubscribeMe = store.subscribe(() => {
            setCoupons(store.getState().couponsState.coupons);
        })
        //if we don't have a user object er are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please login")
            history.push("/login/company");
        } else if (!couponsFetched) {
            getCoupons();
        }
        return function cleanup() {
            unSubscribeMe();
        }
    }, []);

    /**
     * deletes the selected coupon by sending the coupon id to the server
     * @param coupon 
     */
    let handleDelete = async (coupon: CouponModel) => {
        try {
            await jwtAxios.delete<number>(globals.urls.deleteCoupon + coupon.id);
            store.dispatch(couponDeletedAction(coupon.id));
            notify.success("Coupon " + coupon.id + " deleted.");
            history.push("/company")
        } catch (error) {
            notify.error(error);
        }
    }


    function goToUpdateForm(id: string) {
        history.push("/company/update/coupon/" + id)
    }

    useEffect(() => {
        //if we don't have a user object er are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please login")
            history.push("/login/company");
        }
    });

    function send(details: formDetails) {
        setDetails(details);
    }

    const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategoryValue(event.target.value as Category);
    };
    const handleChangePrice = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPriceValue(event.target.value as number);
    };

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
        let myCoupons = coupons;
        if (details?.category !== undefined && details?.maxPrice !== undefined) {
            myCoupons = coupons.filter((c) =>
                (c.price <= details.maxPrice && c.category === details.category));
        }
        return myCoupons;
    }

    return (
        <div className="CompanyDisplay Scroller">
            <NavLink className="addCoupon" to="/company/add/coupon"><OperationCard operation="Add Coupon" /></NavLink>
            <br />
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


            {coupons && showCoupons().map((c) => (<CouponCard key={c.id} coupon={c} myDeleteFunction={handleDelete} myUpdateFunction={goToUpdateForm} />))}
            <br />



            <br />
        </div>
    );
}

export default CompanyDisplay;
