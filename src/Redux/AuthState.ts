import UserModel from "../Models/UserModel";


export class AuthState {
    public user: UserModel = null;
    public constructor() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            this.user = storedUser;
        }
    }
}

// Auth action types:
export enum AuthActionType {
    Login = "Login",
    Logout = "Logout"
}

//Auth action:
export interface AuthAction {
    type: AuthActionType;
    payload?: any; //The ? is for the Logout (payload = usermodel)
}

//Action creators:
export function loginAction(user: UserModel): AuthAction {
    return { type: AuthActionType.Login, payload: user };
}
export function logoutAction(): AuthAction {
    return { type: AuthActionType.Logout };
}

export function authReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.Login://Here the payload is logged user sent from the server
            newState.user = action.payload;
            localStorage.setItem("user", JSON.stringify(newState.user)); //saving in the local storage (won't be deleted)
            break;
        case AuthActionType.Logout: // Here we don't have payload!
            newState.user = null;
            localStorage.removeItem("user"); // clear user from the  local storage.
            break;
    }
    return newState;
}