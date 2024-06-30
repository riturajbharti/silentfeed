import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'SilentFeed | Verification Code',
            react:VerificationEmail({username,otp:verifyCode}),
        });
        return {success:true,message:'Varification Email Sent Succesfully'}
    } catch (emailError) {
        console.error("Error Sending Verfication Email",emailError)
        return {success:false,message:'Failed to Send Varification Email'}
    }
}
