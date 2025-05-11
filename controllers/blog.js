import express from 'express';
import mongoose from 'mongoose';
import { Blogmodel } from '../models/blog.js';

const blogRoutes = express.Router();



/**
 * @swagger
 * /blog/create:
 *   post:
 *     summary: Create a new blog post
 *     description: Creates a new blog post with author details from JWT token
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:  
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog post title
 *               content:
 *                 type: string
 *                 description: Blog post content
 *               category:
 *                 type: string
 *                 description: Blog category (optional)
 *     responses:
 *       201:
 *         description: Blog posted successfully
 *       500:
 *         description: Internal server error
 */



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



/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blog posts
 *     description: Retrieves all blog posts excluding authorID
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   author:
 *                     type: string
 *                   category:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */

//  Function: Retrieves all blog posts while excluding authorID and _id from the response.
blogRoutes.get("/", async (req, res) => {
    //no need for authorization 
    try {
        let blogs = await Blogmodel.aggregate([{ $project: { authorID: 0 } }])
        //   ✅ Client can store the _id (65f3b8e4f12a3c00123abcd4) for future updates. but they need to autenticate 
        res.status(200).json(blogs); // 200 OK for successful response
    } catch (err) {
        res.status(500).json({ "msg": err.message }); // 500 
    }
})

/**
 * @swagger
 * /blog/update/{blogID}:
 *   patch:
 *     summary: Update a blog post
 *     description: Update a blog post (only by the author)
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       403:
 *         description: Unauthorized to update this blog
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */


//Function: the update route to allow only the author to update the blog. 
blogRoutes.patch("/update/:blogID", async (req, res) => {
    try {
        const { blogID } = req.params
        const authorID = req.body.authorID; // Authenticated User ID from token




        // Find the blog

        const blog = await Blogmodel.findById(blogID);





        if (!blog) return res.status(404).json({ "msg": "Blog not found" });

        // Ensure only the author can delete
        if (blog.authorID != authorID) {
            return res.status(403).json({ "msg": "Unauthorized to Update this blog" });
        }

        await Blogmodel.findByIdAndUpdate({ _id: blogID }, req.body)
        res.status(200).send({ "msg": `the note with id${blogID} has been Updated` })

        //   res.status(200).json({ "msg": "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ "msg": err.message });
    }

});

/**
 * @swagger
 * /blog/delete/{blogID}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Delete a blog post (only by the author)
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       403:
 *         description: Unauthorized to delete this blog
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */


//Function: the delete route to allow only the author to delete the blog. 
blogRoutes.delete("/delete/:blogID", async (req, res) => {
    try {
        const { blogID } = req.params
        // console.log(blogID);
        const authorID = req.body.authorID; // Authenticated User ID from token

        // Find the blog    
        const blog = await Blogmodel.findById(blogID);


        if (!blog) return res.status(404).json({ "msg": "Blog not found" });

        // Ensure only the author can delete
        if (blog.authorID != authorID) {
            return res.status(403).json({ "msg": "Unauthorized to delete this blog" });
        }

        await Blogmodel.findByIdAndDelete({ _id: blogID })
        res.status(200).send({ "msg": `the note with id${blogID} has been Deleted` })

        // res.status(200).json({ "msg": "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ "msg": err.message });
    }

});



export { blogRoutes };