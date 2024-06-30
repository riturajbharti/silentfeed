import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessages:boolean;
    isVerfied:boolean;
    messages: Message[]
}

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username Is Required"],
        unique:true,
        trim:true
    },

    email:{
        type:String,
        required:[true,"Username Is Required"],
        unique:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
        ,"Please Use a Valid Email Address"]

    },

    password:{
        type:String,
        required:[true,"Password Is Required"],
    },

    verifyCode:{
        type:String,
        required:[true,"Verify Code Is Required"],
    },

    verifyCodeExpiry:{
        type:Date,
        required:[true,"Expiry Date Is Required"],
    },

    isVerfied:{
        type:Boolean,
        default:false,
    },

    isAcceptingMessages:{
        type:Boolean,
        default:true,
        required:true,
    },

    messages: [MessageSchema]

})

const UserModel =(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;





