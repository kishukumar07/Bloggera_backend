import express from "express";
import mongoose from "mongoose";
import { Blogmodel } from "../models/blog.js";
import { auth } from "../middlewares/auth.js";

const blogRoutes = express.Router();

//Function: Saves a new blog post to the database with relationships.
const create = async (req, res) => {
  try {
    const { title, content, category, authorID, author } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ success: false, msg: "all feild required" });
    }

    const blog = new Blogmodel({ title, content, category, authorID, author });
    await blog.save();
    res.status(201).json({ success: true, msg: "Blog posted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

//Function : Retrives all the blpg posts for a specific user who logged in
//3 more restfull apis for blog-> status based
//if user can ask separately for their blogs ...based on status
const myblogs = async (req, res) => {
  const authorID = req.body.authorID;
  //no need for authorization
  try {
    const blogs = await Blogmodel.find({ authorID }).sort({ createdAt: -1 });
    // console.log(blogs);
    const myResolvedBlogs = await Blogmodel.aggregate([
      { $match: { authorID: authorID, status: "fullfilled" } },
    ]);
    const myRejectedBlogs = await Blogmodel.aggregate([
      { $match: { authorID: authorID, status: "rejected" } },
    ]);
    const myPendingBlogs = await Blogmodel.aggregate([
      { $match: { authorID: authorID, status: "pending" } },
    ]);
    // const myResolvedBlogs
    // const myRejectedBlogs
    return res
      .status(200)
      .json({
        success: true,
        message: "blog fetched successfull",
        blogs,
        myResolvedBlogs,
        myRejectedBlogs,
        myPendingBlogs,
      }); // 200 OK for successful response
  } catch (err) {
    console.log(err.msg);
    res.status(500).json({ success: false, msg: err.message }); // 500
  }
};

//  Function: Retrieves all blog posts while excluding authorID and _id from the response.
const blogById = async (req, res) => {
  const blogId = req.params.blogId;
  //no need for authorization
  // console.log(req.body);
  try {
    let blog = await Blogmodel.findById(blogId);
    //   ✅ Client can store the _id (65f3b8e4f12a3c00123abcd4) for future updates. but they need to autenticate
    // console.log(blog + "ee");
    res.status(200).json({ success: true, blog }); // 200 OK for successful response
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message }); // 500
  }
};

//Function getting all verified blogs
const getAll = async (req, res) => {
  try {
    let blogs = await Blogmodel.aggregate([
      { $match: { status: "fullfilled" } }, //for cms purpose
      { $project: { authorID: 0 } },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ success: true, blogs }); // 200 OK for successful response
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message }); // 500
  }
};

//Function: the update route to allow only the author to update the blog.
const updateBlog = async (req, res) => {
  try {
    const { blogID } = req.params;
    const authorID = req.body.authorID; // Authenticated User ID from token

    // Find the blog

    const blog = await Blogmodel.findById(blogID);

    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // Ensure only the author can delete
    if (blog.authorID != authorID) {
      return res.status(403).json({ msg: "Unauthorized to Update this blog" });
    }

    await Blogmodel.findByIdAndUpdate({ _id: blogID }, req.body);
    res.status(200).send({ msg: `the note with id${blogID} has been Updated` });

    //   res.status(200).json({ "msg": "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Function: the delete route to allow only the author to delete the blog.
const deleteBlog = async (req, res) => {
  try {
    const { blogID } = req.params;
    // console.log(blogID);
    const authorID = req.body.authorID; // Authenticated User ID from token

    // Find the blog
    const blog = await Blogmodel.findById(blogID);

    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // Ensure only the author can delete
    if (blog.authorID != authorID) {
      return res.status(403).json({ msg: "Unauthorized to delete this blog" });
    }

    await Blogmodel.findByIdAndDelete({ _id: blogID });
    res.status(200).send({ msg: `the note with id${blogID} has been Deleted` });

    // res.status(200).json({ "msg": "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { create, myblogs, blogById, getAll, updateBlog, deleteBlog };
