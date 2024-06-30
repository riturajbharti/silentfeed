import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema=z.object({
    username:usernameValidation,
})

export async function GET(request:Request) {
    await dbConnect()

    try {
        console.log(request.url)
        const {searchParams} =new URL(request.url);
        const queryParam = {
            username:searchParams.get('username')
        }
        //validate 
        const result=UsernameQuerySchema.safeParse(queryParam)
        console.log(result); // TODO: remove

        if (!result.success) {
            const usernameErrors= result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0?usernameErrors.join(','):'Invalid Query Parameters' 
            },{status:400})
        }

        const {username} = result.data
        const existingVerifiedUSer=await UserModel.findOne({username,isVerfied:true})

        if(existingVerifiedUSer){
            return Response.json({
                success:false,
                message:'Username is Already Taken'
            },{status:400})
        }

        return Response.json({
            success:true,
            message:'Username is Unique'
        },{status:400})
        


    } catch (error) {
        console.error("Error Checking Username",error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },
        {status:500}
    )
    }
}





