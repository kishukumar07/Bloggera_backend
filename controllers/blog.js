const express =require('express')
const blogRoutes =express.Router()


blogRoutes.get("/",()=>{
    req.end("noteshere")    //testing 
})







module.exports={
    blogRoutes
}