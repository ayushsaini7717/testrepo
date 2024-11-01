import express,{NextFunction, Request,Response} from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'
import IsloggedIn from '../middlewares/IsloggedIn';
import verification from '../middlewares/verfication';
const router=express.Router();

import { PrismaClient } from '@prisma/client'
import { toNamespacedPath } from 'path';


const prisma = new PrismaClient()

router.use(express.json());

router.post('/signup',verification,async (req:Request,res:Response)=>{
    const body=req.body;
    try{
        const user=await prisma.user.create({
            data:{
                username: body.username,
                password: body.password,
                monthlyBudget: body.monthlyBudget
            }
        })
        const token=jwt.sign(body.username,'ayush-secret');
        return res.json({
            token: token,
            userId: user.id
        })
    }catch(error){
        console.log(error);
        return res.json({
            msg: "Something went wrong"
        })
    }
});

router.post('/signin',async (req:Request,res:Response)=>{
    const body=req.body;
    try{
        const user=await prisma.user.findFirst({
            where:{
                username: body.username,
                password: body.password
            }
        })
        if(!user){
            return res.send(`User does'nt exist`);
        }
        const token=jwt.sign(body.username,'ayush-secret');
        return res.json({
            token: token,
            userId: user.id
        })
    }catch(e){
        console.log(e);
        return res.send('Incorrect username or password');
    }
})

router.post('/addincome',IsloggedIn,async (req:Request,res:Response)=>{
    const body=req.body;
    let Id=req.body.userId;
    try{
        const addincome=await prisma.user.update({
            where: {
                id: Id,
            },data: {
                monthlyBudget: {increment: body.amount}
            }
        })
        return res.json({
            msg: "Done!"
        })
    }catch(e){
        console.log(e);
        return res.send("money not added!")
    }
    
})

router.get('/check',(req:Request,res:Response)=>{
    return res.json({
        msg: 'working!'
    });
})



export default router;

