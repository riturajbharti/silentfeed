import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect()

    const {username,content}=await request.json()

    try {
        const user=await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },
            {status:404}
            )
        }
        // is accepting the messages
        if(!user.isAcceptingMessages){
            return Response.json({
                success:false,
                message:"User is Not Accepting the Messages"
            },
            {status:403}
            )
        }
        const newMessage={content,createdAt:new Date()}

        user.messages.push(newMessage as Message);
        await user.save()

        return Response.json({
            success:true,
            message:"Message Sent Succesfully"
        },
        {status:200}
        )
    } catch (error) {
        console.log("Unexpected Error:",error)
        return Response.json({
            success:false,
            message:"Unexpected Error"
        },
        {status:500}
        )
    }
}
