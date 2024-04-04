import {model,Schema,Document, PaginateModel} from "mongoose";
import paginate from "mongoose-paginate-v2"

export interface UserModel extends Document{
    id : any,
    img : string,
    name : string , 
    last_name : string ,
    date : string,
    phone : number,
    email : string,
    nickname : string,
    password : string ,
    role:string,
    is_active:boolean,
    confirmed:boolean,
}
interface UserPaginateModel extends PaginateModel<UserModel> {}
export const UserSchema = new Schema({
    img : {
        type : String,
        },
    name : {
        type : String,
        require : true,
        minlength: 2,
        maxlength: 50
        },
    last_name: {
        type : String,
        require : true,
        minlength: 2,
        maxlength: 80
        },
    date: {
        type : String,
        require : true,
        },
    phone: {
        type : Number,
        require : true,
        unique : true,
        minlength:5,
        maxlength:20
        },
    email: {
        type : String,
        require : true,
        unique : true
        },
    nickname: {
        type : String,
        require : true,
        unique : true
        },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        default : "user",
        enum : ["user","rider","admin","super_admin"]
    },
    is_active:{
        type:Boolean,
        default : false
    },
    confirmed:{
        type:Boolean,
        default : false
    },
},{versionkey:true,timestamps:true});

UserSchema.plugin(paginate)

const User = model<UserModel>('User',UserSchema) as UserPaginateModel

export default User;