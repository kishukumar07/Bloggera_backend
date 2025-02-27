const express =require('express')
const blogRoutes =express.Router()


blogRoutes.get("/",(req,res)=>{
    res.end("data fetched oky !")    //testing 
})


module.exports={
    blogRoutes
}