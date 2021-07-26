import { Button, FormControl, Input, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { couponUpdatedAction } from "../../../../Redux/CouponsState";
import store from "../../../../Redux/Store";
import globals from "../../../../services/Globals";
import SaveIcon from '@material-ui/icons/Save';
import jwtAxios from "../../../../services/JwtAxios";
import notify from "../../../../services/Notifications";
import "./UpdateCouponform.css";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    dates: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))

interface RouteParams {
    id: string;
}

interface UpdateCouponformProps extends RouteComponentProps<RouteParams> { }

/**
 * Displays a form to update the selected coupon, only changed values will be updated.
 */
function UpdateCouponform(props: UpdateCouponformProps): JSX.Element {

    let { register, handleSubmit } = useForm<CouponModel>();
    let history = useHistory();
    const classes = useStyles();

    const [value, setValue] = useState('')

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue(event.target.value as Category);
    };

    let [coupon, setCoupon] = useState<CouponModel>(() =>
        store.getState().couponsState.coupons.find((c) => (
            c.id === parseInt(props.match.params.id))));

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please log in");
            history.push("/login/company")
        } else {
            //      downloads from local storage
            if (coupon === undefined) {
                let storageCoupon = localStorage.getItem("storage-coupon");
                if (storageCoupon !== 'undefined' && storageCoupon !== 'null') {
                    setCoupon(JSON.parse(storageCoupon));
                }
            } else {
                // sends to local storage
                localStorage.setItem("storage-coupon", JSON.stringify(coupon));
            }
        }
    })
    /**
     * check if the values on the form are different from the original values,
     * if do then change original values.
     * @param couponToUpdate 
     */
    const checkChanges = (couponToUpdate: CouponModel) => {
        if (!couponToUpdate.title?.trim()) { couponToUpdate.title = coupon.title}
        if (!couponToUpdate.category) {couponToUpdate.category = coupon.category}
        if (!couponToUpdate.description) {couponToUpdate.description = coupon.description}
        if (!couponToUpdate.startDate) {couponToUpdate.startDate = coupon.startDate}
        if (!couponToUpdate.endDate) {couponToUpdate.endDate = coupon.endDate}
        if (!couponToUpdate.amount) {couponToUpdate.amount = coupon.amount}
        if (!couponToUpdate.price) {couponToUpdate.price = coupon.price}
        if (!couponToUpdate.image.item(0)) {couponToUpdate.imageName = coupon.imageName}
    }

    /**
     * Validates the dates before sending them to the server.
     * @param couponToUpdate
     * @returns true if dates are validated, false if they are not.
     */
    const validateDates = (couponToUpdate: CouponModel): boolean => {
        // console.log("new Date: "+couponToUpdate.endDate.getMilliseconds());
        // if (couponToUpdate.endDate < new Date().toString()) {
        //     notify.error("End date can not be in the past. comes from the front, Alon!")
        //     return false
        // }
        if (couponToUpdate.startDate > couponToUpdate.endDate) {
            notify.error("The expiration date of coupon can not start before start date")
            return false
        }
        return true
    }

    /**
     * Receives the coupon data from the form. The function then makes sure that the 
     * fields are validated before sending the coupon to be updated as FormData to the server.
     * @param couponToUpdate 
     */
    const handleUpdate = async (couponToUpdate: CouponModel) => {
        try {
            checkChanges(couponToUpdate)
            
            if (validateDates(couponToUpdate)) {
                couponToUpdate.id = coupon.id;
                couponToUpdate.company = coupon.company;

                const imgBBFormData = new FormData();
                imgBBFormData.append("image", couponToUpdate.image.item(0))
                imgBBFormData.set("key", "8ff33cec1f9ce459253c24cb2e87e5cf")
                let imgResponse = await axios.post("https://api.imgbb.com/1/upload", imgBBFormData);
                let imgResponseURL = imgResponse.data["data"]["display_url"]

                const myFormData = new FormData();

                myFormData.append("id", couponToUpdate.id.toString());
                myFormData.append("amount", couponToUpdate.amount.toString());
                myFormData.append("category", couponToUpdate.category.toString());
                myFormData.append("description", couponToUpdate.description);
                myFormData.append("stringEndDate", new Date(couponToUpdate.endDate).toISOString().split("T")[0]);
                myFormData.append("price", couponToUpdate.price.toString());
                myFormData.append("stringStartDate", new Date(couponToUpdate.startDate).toISOString().split("T")[0]);
                myFormData.append("title", couponToUpdate.title);
                myFormData.append("imageName", imgResponseURL);

                let response = await jwtAxios.put<CouponModel>(globals.urls.updateCoupon, myFormData);
                let updatedCoupon = response.data;
                console.log("updatedCoupon");
                console.log(updatedCoupon);
                store.dispatch(couponUpdatedAction(updatedCoupon));
                notify.success(updatedCoupon.title + " has been updated");
                setTimeout(() => {
                    history.push("/company")
                }, 1500);
            }
        } catch (error) {
            notify.error(error)
        }
    }

    return (
        <div className="UpdateCouponform">
            <div className=" ">
                {coupon &&
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <FormControl>
                            <InputLabel >Coupon title</InputLabel>
                            <Input id="title" defaultValue={coupon.title} type="text" {...register('title')} inputProps={{ maxLength: 20 }} />
                        </FormControl>
                        <br />
                        <FormControl className={classes.dates}>
                            <InputLabel htmlFor="my-input">Coupon category</InputLabel>
                            <Select  {...register('category')} labelId="labelIdCategories" id="categoriesId" value={!value ? coupon.category : value} onChange={handleChange}>
                                <MenuItem value={Category.FOOD} >Food</MenuItem>
                                <MenuItem value={Category.ELECTRICITY} >Electricity</MenuItem>
                                <MenuItem value={Category.RESTAURANT} >Restaurant</MenuItem>
                                <MenuItem value={Category.VACATION} >Vacation</MenuItem>
                            </Select>
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel >Coupon description</InputLabel>
                            <Input id="description" type="text" {...register('description')} />
                        </FormControl>
                        <br />
                        <FormControl className={classes.dates}>
                            <InputLabel shrink >Coupon start date</InputLabel>
                            <Input id="startDate" defaultValue={coupon.startDate} type="date" {...register('startDate')} />
                        </FormControl>
                        <br />
                        <FormControl className={classes.dates}>
                            <InputLabel shrink >Coupon end date</InputLabel>
                            <Input id="endDate" type="date" defaultValue={coupon.endDate} {...register('endDate')} />
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel >Coupon amount</InputLabel>
                            <Input id="amount" defaultValue={coupon.amount} type="number" inputProps={{ min: 1 }} {...register('amount')} />
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel >Coupon price</InputLabel>
                            <Input id="price" defaultValue={coupon.price} type="number" inputProps={{ min: 0, step: "0.01" }} {...register('price')} />
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
                            <Button variant="contained" size="large" > Back</Button>
                        </NavLink>
                    </form>
                }
            </div>

        </div>
    );
}

export default UpdateCouponform;
