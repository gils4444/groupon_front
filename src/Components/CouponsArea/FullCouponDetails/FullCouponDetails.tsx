import { Button, Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, CardMedia, Theme, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import CouponModel from "../../../Models/CouponModel";
import { ClientType } from "../../../Models/UserModel";
import { couponUpdatedAction } from "../../../Redux/CouponsState";
import { customerUpdatedAction } from "../../../Redux/CustomerState";
import store from "../../../Redux/Store";
import globals from "../../../services/Globals";
import jwtAxios from "../../../services/JwtAxios";
import notify from "../../../services/Notifications";
import "./FullCouponDetails.css";

interface RouteParams {
    id: string;
}

interface FullCouponDetailsProps extends RouteComponentProps<RouteParams> {
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardStyle: {
            width: 350,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9

        },
        title: {
            fontSize: 14,
            marginBottom: 0,
            paddingBottom: 0
        },
        description: {
            marginTop: 0,
            paddingTop: 0,

        },
        content: {
            textAlign: "left"
        },
        buttons: {
            justifyContent: "center"
        }
    }));

function FullCouponDetails(props: FullCouponDetailsProps): JSX.Element {

    let classes = useStyles();
    let user = store.getState().authState?.user;

    let history = useHistory();


    let [coupon, setCoupon] = useState<CouponModel>(() => store.getState().couponsState.coupons.find((c) => (
        c.id === +props.match.params.id)));

    /**
     * If the Client Type is a customer, passes the selected coupon to the server in order to make a purchase. 
     */
    const purchaseCoupon = async () => {
        if (store.getState().authState.user?.clientType === ClientType.CUSTOMER) {
            try {
                let response = await jwtAxios.put<CouponModel>(globals.urls.purchaseCoupon, coupon);
                let customer = store.getState().customerState.customers.find((c) => c.id === user.id);
                customer.coupons.push(response.data);
                store.dispatch(couponUpdatedAction(response.data));
                store.dispatch(customerUpdatedAction(customer));
                notify.success("Coupon " + coupon.title + " purchased");
                history.push("/customer");
            } catch (error) {
                notify.error(error);
            }
        } else {
            notify.error("Please log in to continue purchase")
            history.push("/login/customer");
        }
    }

    // Insures a refresh does not crash the site by using a local storage
    useEffect(() => {
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
    })

    //Gives the user vague amount of the selected coupon 
    const showAmount = (): string => {
        let answer = "No coupons left ";
        if (coupon.amount >= 50) {
            answer = "More than 50 coupons are available";
        }
        else if (coupon.amount < 50 && coupon.amount > 9) {
            answer = "Under 50 coupons left";
        }
        else if (coupon.amount < 10 && coupon.amount > 1) {
            answer = "Under 10 coupons left";
        }
        else if (coupon.amount === 1) {
            answer = "Last coupon left";
        }
        return answer
    }

    //format  the date to dd/MM//yyyy
    function taskDate(date: Date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

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

    /**
     * Decides if to show or not to show the purchase button to the user.
     * Return true if the client type is "guest" or customer that has not buy the coupon yet else return false.
     * @returns 
     */
    const toShowOrNotToShow = (): boolean => {
        if (user?.clientType === ClientType.ADMINISTRATOR)
            return false;
        if (user?.clientType === ClientType.COMPANY)
            return false;
        // check if coupon already exist              
        let currentUser = store.getState().customerState.customers.find(c => c.id === user?.id)
        let coup = currentUser?.coupons.find((c) => c.id === +props.match.params.id)
        if (coup)
            return false;
        return true;
    }
    return (
        <div className="FullCouponDetails">
            {coupon &&
                <Card key={coupon.id} className={classes.cardStyle}>
                    {coupon.imageName !== "no_image" &&
                        <CardMedia
                            className={classes.media}
                            image={globals.urls.images +
                                coupon.imageName}
                        />
                    }
                    <CardHeader className={classes.title} title={coupon.title} subheader={niceString(coupon.category)} />
                    <CardContent className={classes.content} >
                        <Typography className={classes.description} variant="body2" color="textSecondary">
                            {coupon.description}
                        </Typography>
                        Company: {coupon?.company.name}
                        <br />
                        Start Date: &nbsp; {taskDate(coupon.startDate)}
                        <br />
                        End Date: &nbsp; {taskDate(coupon.endDate)}
                        <br />
                        {/* Show the amount only it is larger than 0 or the coupon belongs to the company */}
                        {(coupon.amount > 0 || user?.clientType === ClientType.COMPANY) && <>
                            Amount: &nbsp; {showAmount()}
                            <br />
                            <br />
                        </>
                        }

                        <Typography variant="body1">
                            Price:  ${coupon.price}
                        </Typography>
                    </CardContent>
                    {toShowOrNotToShow() &&
                        <CardActions className={classes.buttons}>
                            <Button
                                onClick={() => purchaseCoupon()}
                                variant="contained" > Purchase </Button>
                        </CardActions>
                    }

                </Card>
            }
            <br />
            <Button variant="contained" color="primary" onClick={history.goBack}> Back</Button>

        </div>
    );
}

export default FullCouponDetails;
