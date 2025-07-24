import { Router } from "express";
import {
  create,
  myblogs,
  blogById,
  getAll,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const blogRoutes = Router();

//Function: Saves a new blog post to the database with relationships.
blogRoutes.post("/create", create);

//Function : Retrives all the blpg posts for a specific user who logged in
blogRoutes.get("/myblogs", myblogs);

//  Function: Retrieves all blog posts while excluding authorID and _id from the response.
blogRoutes.get("/:blogId", blogById);

//Function : Getting all blogs
blogRoutes.get("/", getAll);

//Function: the update route to allow only the author to update the blog.
blogRoutes.patch("/update/:blogID", updateBlog);

//Function: the delete route to allow only the author to delete the blog.
blogRoutes.delete("/delete/:blogID", deleteBlog);

export default blogRoutes;
