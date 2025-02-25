const express =require('express')
const blogRoutes =express.Router()


blogRoutes.get("/",()=>{
    req.end("noteshere")
})



module.exports={
    blogRoutes
}