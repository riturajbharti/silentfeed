import { sendVerificationEmail } from "@/helpers/sendVerfificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {identifier}=await request.json();
        const user = await UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });
        if(!user){
            return Response.json({
                success:false,
                message:"User Does not Exist",
            },
            {
                status:400,
            })
        }

        const verifyCode=Math.floor(100000+Math.random()*900000).toString();
        const username=user.username;
        const email=user.email;
        user.verifyCode=verifyCode;
        user.verifyCodeExpiry=new Date(Date.now()+3600000);
        await user.save();

        const emailRespnse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailRespnse.success){
            return Response.json({
                success:false,
                message:emailRespnse.message
            },{status:500})
        }

        return Response.json({
            success:true,
            message:'Verfication Email Sent'
        },{status:201})



    } catch (error) {
        console.log('User Cannot be found');
        return Response.json({
            success:false,
            message:"Error Finding User",
        },
        {
            status:401,
        })
    }
}
