const express =require('express')
const userRouter = express.Router()


userRouter.get("/",(req,res)=>{
    res.end("user route ")
})

module.exports={
    userRouter
}