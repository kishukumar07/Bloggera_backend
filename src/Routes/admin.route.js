import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";

import {
  loginAdmin,
  getAllUsers,
  deleteUser,
  updateURole,
  viewAllBlogs,
  getPendingBlogs,
  getRejectedBlogs,
  updatingBlogStatus,
  removeBlog,
  getAllContacts,
  updatingContactStatus,
  deleteContact,
  //    dashboard  further ...
  dashboardBlog,
  dashboardContacts,
  dashboardUser,
} from "../controllers/admin.controller.js";

const router = Router();

//AdminLogin   rbac can also do this
router.post("/login", loginAdmin);
//dont you think any one can logged in only want (inter authorization  )

router.use(auth);
router.use(authorize(["admin"]));

// Manage Users
// GET /users → list all users (admin only).
// DELETE /users/:id → delete a specific user (admin only).
// PATCH /users/:id/role → update role (already done).
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateURole);

// Manage Blogs
// GET /blogs → view all blogs (admin only).
// PATCH /blogs/:id/status → approve/reject blog (moderation).
// DELETE /blogs/:id → remove blog (admin only).
router.get("/blogs", viewAllBlogs);
router.get("/blogs/pending", getPendingBlogs);
router.get("/blogs/rejected", getRejectedBlogs);
router.patch("/blog/:id/status", updatingBlogStatus);
router.delete("/blogs/:id", removeBlog);

// Manage Contacts
// GET /contacts → list all contact submissions.
// PATCH /contacts/:id/status → mark resolved.
// DELETE /contacts/:id → delete contact message.
router.get("/contacts", getAllContacts); //this is for admin ..
router.patch("/contacts/:id/status", updatingContactStatus);
router.delete("/contacts/:id", deleteContact);

// Dashboard -> totalc counts for this
// GET /dashboard → overview stats (users, blogs, contacts).
router.get("/dashboard/users", dashboardUser);
router.get("/dashboard/blogs", dashboardBlog);
router.get("/dashboard/contacts", dashboardContacts);

export default router;
