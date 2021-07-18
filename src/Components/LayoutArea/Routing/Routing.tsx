
import {  Redirect, Route, Switch } from "react-router-dom";
import { ClientType } from "../../../Models/UserModel";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import CategoryCoupons from "../../CouponsArea/CategoryCoupons/CategoryCoupons";
import FullCouponDetails from "../../CouponsArea/FullCouponDetails/FullCouponDetails";
import AddCompany from "../../DisplayArea/Admin/AddCompany/AddCompany";
import AddCustomer from "../../DisplayArea/Admin/AddCustomer/AddCustomer";
import AdminDisplay from "../../DisplayArea/Admin/AdminDisplay/AdminDisplay";
import DeleteCompany from "../../DisplayArea/Admin/DeleteCompany/DeleteCompany";
import DeleteCustomer from "../../DisplayArea/Admin/DeleteCustomer/DeleteCustomer";
import UpdateCompany from "../../DisplayArea/Admin/UpdateCompany/UpdateCompany";
import UpdateCompanyForm from "../../DisplayArea/Admin/UpdateCompanyForm/UpdateCompanyForm";
import UpdateCustomer from "../../DisplayArea/Admin/UpdateCustomer/UpdateCustomer";
import UpdateCustomerForm from "../../DisplayArea/Admin/UpdateCustomerForm/UpdateCustomerForm";
import AddCoupon from "../../DisplayArea/Company/AddCoupon/AddCoupon";
import CompanyDisplay from "../../DisplayArea/Company/CompanyDisplay/CompanyDisplay";
import UpdateCouponform from "../../DisplayArea/Company/UpdateCouponform/UpdateCouponform";
import CustomerDisplay from "../../DisplayArea/Customer/CustomerDisplay/CustomerDisplay";
import Page404 from "../../SharedArea/Page404/Page404";
import Home from "../Home/Home";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
			<Switch>
                <Route exact path="/home" component={Home} />
                {/* ADMINISTRATOR */}
                <Route exact path="/administrator" component={AdminDisplay} />
                {/* admin -> company */}
                <Route exact path="/admin/add/company" component={AddCompany} />
                <Route exact path="/admin/delete/company" component={DeleteCompany} />
                <Route exact path="/admin/update/company" component={UpdateCompany} />
                <Route exact path="/admin/update/company/:id" component={UpdateCompanyForm} />
                {/* admin -> customer */}
                <Route exact path="/admin/add/customer" component={AddCustomer} />
                <Route exact path="/admin/update/customer" component={UpdateCustomer} />
                <Route exact path="/admin/delete/customer" component={DeleteCustomer} />
                <Route exact path="/admin/update/customer/:id" component={UpdateCustomerForm} />

                {/* COMPANY */}
                <Route exact path="/company" component={CompanyDisplay} />  
                <Route exact path="/company/add/coupon" component={AddCoupon} />
                <Route exact path="/company/update/coupon/:id" component={UpdateCouponform} />

                {/* CUSTOMER */}
                <Route exact path="/customer" component={CustomerDisplay} />

                {/* Guest */}
                <Route exact path="/coupons/category/:category" component={CategoryCoupons} />
                <Route exact path="/coupons/full-details/:id" component={FullCouponDetails} />

                {/* LOGIN/LOGOUT */}
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/login/admin" render={(props) => <Login type={ClientType.ADMINISTRATOR} {...props} /> } />
                <Route exact path="/login/company" render={(props) => <Login type={ClientType.COMPANY} {...props} /> } />
                <Route exact path="/login/customer" render={(props) => <Login type={ClientType.CUSTOMER} {...props} /> } />

                <Redirect from ="/" to = "/home" exact/>
                <Route component={Page404}/>
            </Switch>
        </div>
    );
}

export default Routing;
