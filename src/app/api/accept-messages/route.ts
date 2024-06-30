import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";

export async function POST(request:Request) {
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User=session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },
        {status:400}
        )
    }

    const userId=user._id

    const {acceptMessages}=await request.json()

    try {
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,{isAcceptingMessages:acceptMessages},
            {new:true}
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed To Update User Status To accept Mesaages"
            },
            {status:401}
            )
        }

        return Response.json({
            success:true,
            message:"Messages Acceptance Status Updates Succesfully",
            updatedUser
        },
        {status:200}
        )
    } catch (error) {
        console.log('Failed To Update User Status To accept Mesaages')
        return Response.json({
            success:false,
            message:"Failed To Update User Status To accept Mesaages"
        },
        {status:500}
        )
    }


}

export async function GET(request:Request) {
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User=session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },
        {status:400}
        )
    }

    const userId=user._id;

    try {
        const foundUser=await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User Not Found"
            },
            {status:401}
            )
        }
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessages,
        },
        {status:200}
        )
    } catch (error) {
        console.log('Error is Getting Message Accepting Status')
        return Response.json({
            success:false,
            message:"Error is Getting Message Accepting Status"
        },
        {status:500}
        )
    }
}

