import { Router } from "express";
import {
  create,
  myblogs,
  blogById,
  getAll,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { authorize } from "../middlewares/authorization.js";
import { auth } from "../middlewares/auth.js";

const blogRoutes = Router();

//Function: Saves a new blog post to the database with relationships.
blogRoutes.post("/create", auth, authorize(["user"]), create);

//Function : Retrives all the blpg posts for a specific user who logged in
blogRoutes.get("/myblogs", auth, authorize(["user"]), myblogs);

//  Function: Retrieves all blog posts while excluding authorID and _id from the response.
blogRoutes.get("/:blogId", auth, authorize(["user", "admin"]), blogById);

//Function : Getting all blogs
blogRoutes.get("/", auth, authorize(["user", "admin"]), getAll);

//Function: the update route to allow only the author to update the blog.
blogRoutes.patch("/update/:blogID", auth, authorize(["user"]), updateBlog);

//Function: the delete route to allow only the author to delete the blog.
blogRoutes.delete(
  "/delete/:blogID",
  auth,
  authorize(["user", "admin"]),
  deleteBlog
);

export default blogRoutes;
