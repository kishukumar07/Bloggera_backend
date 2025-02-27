const express = require('express')
const blogRoutes = express.Router()
const mongoose = require('mongoose')
const {Blogmodel} = require('../models/blog')


//Function: Saves a new blog post to the database with relationships. 
blogRoutes.post("/create", async (req, res) => {
    try {
      const blog = new Blogmodel(req.body);  //as req body have author details by default 
    //   console.log(blog);  
      await blog.save();
      res.status(201).json({ "msg": "Blog posted successfully" });
    } catch (err) {
      res.status(500).json({ "msg": err.message });
    }
  });



//  Function: Retrieves all blog posts while excluding authorID and _id from the response.

blogRoutes.get("/", async(req, res) => {
//no need for authorization 
try{
    let blogs = await Blogmodel.aggregate([{$project:{authorID:0}}]) 
    //   ✅ Client can store the _id (65f3b8e4f12a3c00123abcd4) for future updates. but they need to autenticate 
    res.status(200).json(blogs); // 200 OK for successful response
}catch(err){
    res.status(500).json({ "msg": err.message}); // 500 
}

})

blogRoutes.delete("/delete/:blogID", async (req, res) => {    
const {blogID}=req.params




  });
  

  






module.exports = {
    blogRoutes
}