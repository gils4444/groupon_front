import CouponModel from "../Models/CouponModel";


export class CouponsState {
    public coupons: CouponModel[] = [];
}

export enum CouponsActionType {

    CouponsDownloaded = "CouponsDownloaded",
    CouponAdded = "CouponAdded",
    CouponUpdated = "CouponUpdated",
    CouponDeleted = "CouponDeleted"
}

export interface CouponAction {
    type: CouponsActionType;
    payload: any;
}

export function couponsDownloadedAction(coupons: CouponModel[]): CouponAction {
    return { type: CouponsActionType.CouponsDownloaded, payload: coupons };
}

export function couponAddedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponAdded, payload: coupon };
}

export function couponUpdatedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponUpdated, payload: coupon };
}

export function couponDeletedAction(id: number): CouponAction {
    return { type: CouponsActionType.CouponDeleted, payload: id };
}

export function couponsReducer(currentState: CouponsState = new CouponsState(), action: CouponAction): CouponsState {

    const newState = { ...currentState }; //Spread Operator - שכפול האובייקט

    let index;

    switch (action.type) {
        case CouponsActionType.CouponsDownloaded:
            newState.coupons = action.payload;
            break;
        case CouponsActionType.CouponAdded:
            //add to state if the coupon isn't there
            if (!newState.coupons.includes(action.payload)) {
                newState.coupons.push(action.payload);
            }
            break;
        case CouponsActionType.CouponUpdated:
            index = newState.coupons.findIndex(element => element.id === action.payload.id);
            newState.coupons[index] = action.payload;
            break;
        case CouponsActionType.CouponDeleted:
            index = newState.coupons.findIndex(element => element.id === action.payload);
            newState.coupons.splice(index, 1);
            break;
    }

    return newState;
}