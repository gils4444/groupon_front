import { ClientType } from './UserModel';

class CredentialsModel {
    public email: string;
    public password: string;
    public clientType:ClientType;
}

export default CredentialsModel;