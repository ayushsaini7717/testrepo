import { Response,Request,NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()




export const verification=(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const body=req.body;
        const user=await prisma.user.findFirst({
            where:{
                username: body.username
            }
        })
        if(!user){
            next();
        }else{
            return res.send("Username already exist");
        }
    }catch(error){
        console.log("error is: ",error);
    }
})

export default verification