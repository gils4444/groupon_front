import { Button, FormControl, Input, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SaveIcon from '@material-ui/icons/Save';
import { useHistory } from "react-router";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { couponAddedAction } from "../../../../Redux/CouponsState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import "./AddCoupon.css";
import { NavLink } from "react-router-dom";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
    dates: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))

/**
 *Displays a form to the company to add a new coupon .
 */
function AddCoupon(): JSX.Element {

    const classes = useStyles();

    const [value, setValue] = useState('')

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue(event.target.value as Category);
    };

    let { register, handleSubmit } = useForm<CouponModel>();
    let history = useHistory();

    useEffect(() => {
        //if we don't have a user object er are not logged in
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please login")
            history.push("/login/company");
        }
    });

    /**
     * Receives the coupon data from the form. The function then sends the coupon
     * as FormData to the server.
     * @param coupon 
     */
    async function send(coupon: CouponModel) {
        try {
            const myFormData = new FormData();

            const imgBBFormData = new FormData();
            imgBBFormData.append("image", coupon.image.item(0))
            imgBBFormData.set("key", "531f96433eff28c617e0d67c73f5ae9b")

            let imgResponse = await axios.post("https://api.imgbb.com/1/upload", imgBBFormData);

            let imgResponseURL = imgResponse.data["data"]["display_url"]

            myFormData.append("amount", coupon.amount.toString());
            myFormData.append("category", coupon.category.toString());
            myFormData.append("description", coupon.description);
            myFormData.append("endDate", new Date(coupon.endDate).toISOString().split("T")[0]);

            myFormData.append("price", coupon.price.toString());
            myFormData.append("startDate", new Date(coupon.startDate).toISOString().split("T")[0]);
            myFormData.append("title", coupon.title);
            myFormData.append("imageName", imgResponseURL);


            let response = await jwtAxios.post<CouponModel>(globals.urls.addCoupon, myFormData);
            const addedCoupon = response.data;
            store.dispatch(couponAddedAction(addedCoupon));

            notify.success("Coupon " + addedCoupon.title + " added")
            setTimeout(() => {
                history.push("/company");
            }, 1500);
        } catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="AddCoupon">
            <div className=" ">
                <form encType="multipart/form-data" onSubmit={handleSubmit(send)}>
                    <FormControl>
                        <InputLabel >Coupon title</InputLabel>
                        <Input required id="title" type="text"  {...register('title')} inputProps={{maxLength:20}}/>
                    </FormControl>
                    <br />
                    <FormControl className={classes.dates}>
                        <InputLabel >Coupon category</InputLabel>
                        <Select {...register('category')} labelId="labelIdCategories" required id="categoriesId" value={value} onChange={handleChange}>
                            <MenuItem value={Category.FOOD} >Food</MenuItem>
                            <MenuItem value={Category.ELECTRICITY} >Electricity</MenuItem>
                            <MenuItem value={Category.RESTAURANT} >Restaurant</MenuItem>
                            <MenuItem value={Category.VACATION} >Vacation</MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Coupon description</InputLabel>
                        <Input required id="description" type="text"  {...register('description')} />
                    </FormControl>
                    <br />
                    <FormControl className={classes.dates}>
                        <InputLabel shrink >Coupon start date</InputLabel>
                        <Input required id="startDate" type="date" {...register('startDate')} />
                    </FormControl>
                    <br />
                    <FormControl className={classes.dates}>
                        <InputLabel shrink >Coupon end date</InputLabel>
                        <Input required id="endDate" type="date"  {...register('endDate')} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Coupon amount</InputLabel>
                        <Input required id="amount" type="number" inputProps={{min:1}} {...register('amount')} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Coupon price</InputLabel>
                        <Input required id="price" type="number" inputProps={{min:0, step:"0.01"}} {...register('price')} />
                    </FormControl>
                    <br />
                    <br />
                    <FormControl>
                        <Button size="small" variant="contained" component="label"> Upload Picture
                            <input hidden type="file" name="image" {...register('image')} accept="image/*" />
                        </Button>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="contained" color="primary" size="large" type="submit" startIcon={<SaveIcon />}> save</Button>
                    &nbsp;
                    <NavLink to="/company">
                        <Button variant="contained" size="large" color="primary"  > Back</Button>
                    </NavLink>
                </form>
            </div>
        </div>
    );
}

export default AddCoupon;
