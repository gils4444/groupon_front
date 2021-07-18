
export enum ClientType{
    ADMINISTRATOR="ADMINISTRATOR",COMPANY="COMPANY",CUSTOMER="CUSTOMER"
}

class UserModel {

    public id: number;
    public name:string;
    public email:string;
    public password:string;
    public token:string;
    public clientType:ClientType;

}

export default UserModel;