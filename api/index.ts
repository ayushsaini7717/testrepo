import express from 'express';
const port=3000;
const app=express();
import router from "../Routes/userRoute";
import expense from '../Routes/expenseRoute';
import cors from 'cors';

app.use(cors());

app.use('/api/v1/user',router);
app.use('/api/v1/expense',expense);

app.listen(port,()=>{
    console.log(`server is running on port: ${port}`);
})


	

