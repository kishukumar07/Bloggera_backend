const express =require('express')
const blogRoutes =express.Router()

//have to complete this route 

blogRoutes.get("/",(req,res)=>{
    res.end("data fetched oky !")    //testing 
})






module.exports={
    blogRoutes
}