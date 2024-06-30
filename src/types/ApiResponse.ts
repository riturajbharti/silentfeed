import { Message } from "@/model/User"; 

export interface ApiResponse{
    success:Boolean;
    message:string;
    isAcceptingMessages?:boolean;
    messages?:Array<Message>;

}