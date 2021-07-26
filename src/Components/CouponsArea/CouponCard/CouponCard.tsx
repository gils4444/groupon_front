import { Button, Card, CardMedia, CardActions, CardContent, CardHeader, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { ClientType } from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import globals from "../../../services/Globals";
import "./CouponCard.css";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardStyle: {
            width: 255,
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
            paddingTop: 0
        },
        content: {
            textAlign: "left"
        },
        myButtons: {
            justifyContent: "center"
        }

    }));

interface CouponCardProps {
    coupon: CouponModel;
    myDeleteFunction?: Function;
    myUpdateFunction?: Function;
}

function CouponCard(props: CouponCardProps): JSX.Element {

    let classes = useStyles();
    let location = useLocation();

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
     * 
     * Only show the coupon if there is more than one (amount >0),
     * it is the logged in company's coupon, or the admin is the user 
     */
    const showCoupon = (): boolean => {
        let user = store.getState().authState.user;
        if (user?.clientType === ClientType.COMPANY && user.id === props.coupon.company.id)
            return true;
        if (user?.clientType === ClientType.ADMINISTRATOR)
            return true;
        if (props.coupon.amount > 0)
            return true;
        if (user?.clientType === ClientType.CUSTOMER) {
            let cust = store.getState().customerState.customers.find((c) => c.id === user.id);
            if (cust !== undefined) {
                let matchCoupon = cust.coupons.find((c) => c.id === props.coupon.id);
                if (matchCoupon !== undefined)
                    return true;
            }
        }
        return false;

    }
    let img1 = "https://firebasestorage.googleapis.com/v0/b/coupon-images-a46e8.appspot.com/o/dog.jfif?alt=media&token=c0a4011e-d3fd-44e6-badb-918e1106f4e2"
    return (
        <div className="CouponCard">
            {showCoupon &&
                
                <Card key={props.coupon.id} className={classes.cardStyle} >
                    
                    <NavLink key={props.coupon.id} to={"/coupons/full-details/" + props.coupon.id.toString()}>
                        {props.coupon.imageName !== "no_image" &&
                            <CardMedia
                                className={classes.media}
                                image={props.coupon.imageName}
                            />
                        }

                        <CardHeader className={classes.title} title={props.coupon.title} titleTypographyProps={{ variant: 'h6' }} />
                        <CardContent className={classes.content}>
                            <Typography className={classes.description} variant="body2" color="textSecondary">
                                {props.coupon.description}
                            </Typography>
                            {"Price: $" + props.coupon.price}
                            <br />
                            {"End date: " + taskDate(props.coupon.endDate)}
                            <br />
                            {"By: " + props.coupon?.company.name}
                        </CardContent>
                    </NavLink>

                    {
                        location.pathname.toString() === "/company" &&
                        <CardActions className={classes.myButtons}>
                            <Button onClick={() => props.myUpdateFunction(props.coupon.id)} variant="contained" color="primary">Update</Button> &nbsp;
                            <Button onClick={() => props.myDeleteFunction(props.coupon)} variant="contained" color="secondary" >Delete</Button>
                        </CardActions>
                    }

                </Card>
            }
        </div>
    );
}

export default CouponCard;
