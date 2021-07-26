//Globals settings which are the same for development and production
class Globals {

}
//Globals settings which are suitable only for development
class DevelopmentGlobals extends Globals {
    public urls = {
        categoryCoupons: "http://localhost:8080/Guest/get/coupons/category/",
        login:"http://localhost:8080/login",
        images: "http://localhost:8080/",
        
        //
        //Admin Area
        //
        // Company
        addCompany:"http://localhost:8080/admin/add/company",
        deleteCompany:"http://localhost:8080/admin/delete/company/",
        updateCompany:"http://localhost:8080/admin/update/company",
        getAllCompanies:"http://localhost:8080/admin/get/company/all",
        //Customer
        addCustomer:"http://localhost:8080/admin/add/customer",
        getAllCustomers:"http://localhost:8080/admin/get/customer/all",
        updateCustomer:"http://localhost:8080/admin/update/customer",
        deleteCustomer:"http://localhost:8080/admin/delete/customer/",
        
        //
        //Company Area
        //
        
        //Coupon
        addCoupon:"http://localhost:8080/company/add/coupon",
        getAllCoupons:"http://localhost:8080/company/getCoupons",
        updateCoupon:"http://localhost:8080/company/update/coupon",
        deleteCoupon:"http://localhost:8080/company/delete/coupon/",
        addImage:"http://localhost:8080/uploadFile",

        //
        // Customer Area
        //
        getCustomerDetails:"http://localhost:8080/customer/get/customer/details",
        getCustomerCoupons:"http://localhost:8080/customer/get/coupons/all",
        purchaseCoupon:"http://localhost:8080/customer/purchase-coupon/",
        
        //
        // Guest Area
        //
        addCustomerAsGuest:"http://localhost:8080/Guest/add/customer/"
    };
}

//Globals settings which are suitable only for production
class ProductionGlobals extends Globals {
    public myURL ="https://groupon-java.herokuapp.com";
    public urls = {
        categoryCoupons: this.myURL+ "/Guest/get/coupons/category/",
        login:this.myURL+"/login",

        //
        // Admin Area
        //
        
        //company
        addCompany:this.myURL+"/admin/add/company",
        deleteCompany:this.myURL+"/admin/delete/company/",
        updateCompany:this.myURL+"/admin/update/company",
        getAllCompanies:this.myURL+"/admin/get/company/all",
        //Customer
        addCustomer:this.myURL+"/admin/add/customer",
        getAllCustomers:this.myURL+"/admin/get/customer/all",
        updateCustomer:this.myURL+"/admin/update/customer",
        deleteCustomer:this.myURL+"/admin/delete/customer/",
       
        //
        //Company Area
        //
        
        //Coupon
        addCoupon:this.myURL+"/company/add/coupon",
        getAllCoupons:this.myURL+"/company/getCoupons",
        updateCoupon:this.myURL+"/company/update/coupon",
        deleteCoupon:this.myURL+"/company/delete/coupon/",
        addImage:this.myURL+"/uploadFile",
        
        //
        // Customer Area
        //
        getCustomerDetails:this.myURL+"/customer/get/customer/details",
        getCustomerCoupons:this.myURL+"/customer/get/coupons/all",
        purchaseCoupon:this.myURL+"/customer/purchase-coupon/",
        //
        // Guest Area
        //
        addCustomerAsGuest:this.myURL+"/Guest/add/customer/"
        
    };
}

const globals = process.env.NODE_ENV === "development" ? new DevelopmentGlobals() : new ProductionGlobals();

export default globals;


