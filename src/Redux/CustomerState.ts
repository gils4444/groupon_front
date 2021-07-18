import CustomerModel from "../Models/CustomerModel";


export class CustomerState {
    public customers: CustomerModel[] = [];
}

export enum CustomerActionType {

    CustomerDownloaded = "CustomerDownloaded",
    CustomerAdded = "CustomerAdded",
    CustomerUpdated = "CustomerUpdated",
    CustomerDeleted = "CustomerDeleted"
}

export interface CustomerAction {
    type: CustomerActionType;
    payload: any;
}

export function customersDownloadedAction(customers: CustomerModel[]): CustomerAction {
    return { type: CustomerActionType.CustomerDownloaded, payload: customers };
}

export function customerAddedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomerActionType.CustomerAdded, payload: customer };
}

export function customerUpdatedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomerActionType.CustomerUpdated, payload: customer };
}

export function customerDeletedAction(id: number): CustomerAction {
    return { type: CustomerActionType.CustomerDeleted, payload: id };
}


// Customer
// customer
export function customerReducer(currentState: CustomerState = new CustomerState(),
    action: CustomerAction): CustomerState {

    const newState = { ...currentState }; //Spread Operator - שכפול האובייקט

    let index;

    switch (action.type) {
        case CustomerActionType.CustomerDownloaded:
            newState.customers = action.payload;
            break;
        case CustomerActionType.CustomerAdded:
            newState.customers.push(action.payload);
            break;
        case CustomerActionType.CustomerUpdated:
            index = newState.customers.findIndex(element => element.id === action.payload.id);
            newState.customers[index] = action.payload;
            break;
        case CustomerActionType.CustomerDeleted:
            index = newState.customers.findIndex(element => element.id === action.payload);
            newState.customers.splice(index, 1);
            break;
    }

    return newState;
}