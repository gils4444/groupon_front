import CompanyModel from "../Models/CompanyModel";


export class CompanyState {
    public companies: CompanyModel[] = [];
}

export enum CompaniesActionType {

    CompanyDownloaded = "CompanyDownloaded",
    CompanyAdded = "CompanyAdded",
    CompanyUpdated = "CompanyUpdated",
    CompanyDeleted = "CompanyDeleted"
}

export interface CompanyAction {
    type: CompaniesActionType;
    payload: any;
}

export function companiesDownloadedAction(companies: CompanyModel[]): CompanyAction {
    return { type: CompaniesActionType.CompanyDownloaded, payload: companies };
}

export function companyAddedAction(company: CompanyModel): CompanyAction {
    return { type: CompaniesActionType.CompanyAdded, payload: company };
}

export function companyUpdatedAction(company: CompanyModel): CompanyAction {
    return { type: CompaniesActionType.CompanyUpdated, payload: company };
}

export function companyDeletedAction(id: number): CompanyAction {
    return { type: CompaniesActionType.CompanyDeleted, payload: id };
}

export function companyReducer(currentState: CompanyState = new CompanyState(),
    action: CompanyAction): CompanyState {

    const newState = { ...currentState }; //Spread Operator - שכפול האובייקט

    let index;

    switch (action.type) {
        case CompaniesActionType.CompanyDownloaded:
            newState.companies = action.payload;
            break;
        case CompaniesActionType.CompanyAdded:
            newState.companies.push(action.payload);
            break;
        case CompaniesActionType.CompanyUpdated:
            index = newState.companies.findIndex(element => element.id === action.payload.id);
            newState.companies[index] = action.payload;
            break;
        case CompaniesActionType.CompanyDeleted:
            index = newState.companies.findIndex(element => element.id === action.payload);
            newState.companies.splice(index, 1);
            break;
    }

    return newState;
}