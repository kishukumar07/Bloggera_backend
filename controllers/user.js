const express =require('express')
const userRoutes = express.Router()
const { Usermodel } =require('../models/user')

userRoutes.post("/register",async(req,res)=>{

    try{
        const user =  new Usermodel(req.body)
                   await user.save(); 
         res.status(200).json("user registered ")

  }catch(err){
         res.status(400).json({"msg":err.message})
    }


})




module.exports={
    userRoutes
}