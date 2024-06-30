import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerfificationEmail";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,email,password} =await request.json();
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username,isVerfied:true,
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:'Username is Already taken'
            },{status:400})
        }

        const exisitingUserbyEmail= await UserModel.findOne({email});
        const verifyCode=Math.floor(100000+Math.random()*900000).toString();

        if(exisitingUserbyEmail){
            if(exisitingUserbyEmail.isVerfied){
                return Response.json({
                    success:false,
                    message:'Email Already Exists'
                },{status:400})
            }else{
                const hashedPassword=await bcrypt.hash(password,10);
                exisitingUserbyEmail.password=hashedPassword;
                exisitingUserbyEmail.verifyCode=verifyCode;
                exisitingUserbyEmail.verifyCodeExpiry=new Date(Date.now()+3600000)

                await exisitingUserbyEmail.save()
            }
        }else{
            const hashedPassword= await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessages:true,
                isVerfied:false,
                messages: [],
            })

            await newUser.save()
        }

        // send verification email
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
            message:'User Registered Succesfully,please Verify email'
        },{status:201})

    } catch (error) {
        console.error("Error Registering User",error)
        return Response.json({
            success:false,
            message:"Error Registering User",
        },
        {
            status:500,
        }
    )
    }
}