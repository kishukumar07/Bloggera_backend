const express = require('express')
const blogRoutes = express.Router()
const mongoose = require('mongoose')
const {Blogmodel} = require('../models/blog')

blogRoutes.get("/", async(req, res) => {
//no need for authorization 

try{
    let blogs = await Blogmodel.aggregate([{$match:{ authorID: req.body.authorID }}])

    res.status(200).json(blogs); // 200 OK for successful response
    
}catch(err){
    res.status(500).json({ "msg": err.message}); // 500 
}


})



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
  






module.exports = {
    blogRoutes
}