import { combineReducers, createStore } from "redux";
import { authReducer } from "./AuthState";
import { companyReducer } from "./CompanyState";
import { couponsReducer } from "./CouponsState";
import { customerReducer } from "./CustomerState";

const reducers = combineReducers({ couponsState: couponsReducer, authState: authReducer,
     companyState: companyReducer, customerState: customerReducer });
const store = createStore(reducers);


export default store;
