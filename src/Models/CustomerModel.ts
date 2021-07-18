import CouponModel from "./CouponModel";

class CustomerModel{
    public id:number;
    public firstName:string;
    public lastName:string;
    public email:string;
    public password:string;
    public coupons:CouponModel[];

}

export default CustomerModel;