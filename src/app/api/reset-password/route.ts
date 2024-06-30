import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

export async function POST(request:Request) {
    await dbConnect();
    
    try {

        const {code,newpassword}=await request.json();
        const {searchParams} =new URL(request.url);
        const url_data=searchParams.get('identifier');
        const identifier=url_data !== null ? decodeURIComponent(url_data) : '';

        const user = await UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });

        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },
            {status:500}
        )
        }

        const isCodeValid=user.verifyCode === code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerfied=true;
            const hashedPassword=await bcrypt.hash(newpassword,10);
            user.password=hashedPassword;
            await user.save()
            return Response.json({
                success:true,
                message:"Password Updated Succesfully, Please Login"
            },
            {status:200}
        )
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification Code has expired,Please try again!!"
            },
            {status:400}
        )
        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification Code"
            },
            {status:400}
        )
        }


    } catch (error) {
        return Response.json({
            success:false,
            message:'Error in Updating Password,Please try After Sometime',
        },{status:500})
    }

}