import CompanyModel from "./CompanyModel";

export enum Category{
    FOOD="FOOD", ELECTRICITY="ELECTRICITY", RESTAURANT="RESTAURANT", VACATION="VACATION"
}

class CouponModel{
    public id: number;
    public category: Category;
    public title: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public amount: number;
    public price:number;
    public image:FileList;
    public company:CompanyModel;
    public imageName: string;
    public token: string;
}

export default CouponModel;