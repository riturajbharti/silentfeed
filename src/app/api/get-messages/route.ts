import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request){
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

    const userId=new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
          ]).exec();

        if(!user || user.length===0){
            return Response.json({
                success:false,
                message:`Hello ${userId} User Not Found`
            },
            {status:401}
            )
        }

        return Response.json({
            success:true,
            messages:user[0].messages,
        },
        {status:200}
        )
    } catch (error) {
        console.log("Error Adding Messages:",error)
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },
        {status:500}
        )
    }


}