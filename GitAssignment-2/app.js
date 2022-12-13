const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();

// Import Routes
const loginRoutes=require("./src/routes/login");
const postRoutes=require('./src/routes/post');
const jwt=require('jsonwebtoken');
const secret=process.env.SECRET;

// Router Middleware
app.use(express.json());

app.use('/post',(req,res,next)=>{
    if(req.headers.authorization){
        const token=req.headers.authorization;
        if(token){
            jwt.verify(token,secret,(err,decoded)=>{
                if(err){
                    return res.status(403).json({
                        status:'failed',
                        message:'Not a valid Token'
                    });
                }
                req.user=decoded.data;
                next();
            });
        }else{
            return res.status(401).json({
                status:'failed',
                message:"Token is missing"
            });
        }
    }else{
        return res.status(403).json({
            status:'failed',
            message:"User is not Authenticated"
        });
    }
});

app.use("/",loginRoutes);
app.use('/',postRoutes);

module.exports=app;