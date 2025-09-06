import { Usermodel } from "../models/user.js";
import { contactMsgModel } from "../models/contact.js";
import { Blogmodel } from "../models/blog.js";
import { BlacklistModel } from "../models/blacklist.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRoutes from "../Routes/user.route.js";
//Admin things
const loginAdmin = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Bad Input" });
    }
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide the valid credentials",
      });
    }

    const admin = await Usermodel.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "ADMIN DOESN'T EXIST WITH THIS CREDENTIALS",
      });
    }

    if (admin.role != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "You are Unauthorized to do this !" });
    }

    const hashPassword = admin.password;
    bcrypt.compare(password, hashPassword, (err, result) => {
      // result == true
      if (err) {
        return res
          .status(500)
          .json({ success: false, msg: "Internal server error" });
      }

      if (!result) {
        return res
          .status(401)
          .json({ success: false, msg: "Wrong credentials." });
      }

      //token generation  ...
      const token = jwt.sign(
        { authorID: admin._id, author: admin.name, role: admin.role },
        process.env.jwtSecretKey,
        { expiresIn: "24h" }
      );

      //refresh token ...

      const reftoken = jwt.sign(
        { authorID: admin._id, author: admin.name, role: admin.role },
        process.env.REF_SECRET,
        {
          expiresIn: "72h",
        }
      );

      //login succed ...
      return res.status(200).json({
        success: true,
        message: "Loggin Successfull ",
        token,
        reftoken,
      });
      //try catch execution ...
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Manage Users

const getAllUsers = async (req, res) => {
  try {
    // Get users (hide password and other sensitive fields)
    const users = await Usermodel.aggregate([
      { $match: { role: "user" } },
      { $sort: { createdAt: 1 } },
      { $project: { password: 0, __v: 0 } }, // hide password and __v
    ]);

    // Get total user count using aggregation
    const countResult = await Usermodel.aggregate([
      { $match: { role: "user" } },
      { $count: "totalUsers" },
    ]);
    // console.log(countResult);
    const totalUsers = countResult[0]?.totalUsers || 0;

    res.status(200).json({
      success: true,
      totalUsers,
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete user controller
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Find and delete the user
    const deletedUser = await Usermodel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User removed successfully",
      user: deletedUser, // optional: you can return deleted user info
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// For later implementation
const updateURole = async (req, res) => {
  try {
    const id = req.params.id;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // find user
    const user = await Usermodel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // get current role from DB
    const currentRole = user.role;

    console.log(currentRole);
    // validate role
    if (!currentRole || !["user", "admin"].includes(currentRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role in database",
      });
    }

    // toggle role (if user → admin, if admin → user)
    const newRole = currentRole === "user" ? "admin" : "user";

    // update role
    const updatedUser = await Usermodel.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true, runValidators: true, select: "-password -__v" }
    );

    res.status(200).json({
      success: true,
      message: `User role updated from ${currentRole} to ${newRole}`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Manage Blogs
const viewAllBlogs = async (req, res) => {
  try {
    // Get users (hide password and other sensitive fields)
    const blogs = await Blogmodel.aggregate([{ $sort: { createdAt: 1 } }]);

    // Get total user count using aggregation
    const countResult = await Usermodel.aggregate([{ $count: "totalblogs" }]);
    // console.log(countResult);
    const totalblogs = countResult[0]?.totalblogs || 0;

    res.status(200).json({
      success: true,
      totalblogs,
      blogs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//updating blog cms ...>>
const updatingBlogStatus = async (req, res) => {
  //blog/:id/status
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Bad request" });
    }

    const blog = await Blogmodel.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not Found" });
    }

    const currentStatus = blog.status;

    const status = ["pending", "rejected", "fullfilled"];

    const toggleStatus = (currentStatus) => {
      const currentIndex = status.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % status.length;
      return status[nextIndex];
    };

    const newStatus = toggleStatus(currentStatus); //this will get next status

    console.log(newStatus);

    const updatedblog = await Blogmodel.findByIdAndUpdate(
      id,
      {
        status: newStatus,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `blog is now set to ${newStatus}`,
      updatedblog,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const removeBlog = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, msg: "id not provided" });
    }
    const removedBlog = await Blogmodel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "blog Removed succesfull", removedBlog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

//Manage Contacts
const getAllContacts = async (req, res) => {
  try {
    const messages = await contactMsgModel.find().sort({ createdAt: -1 }); // Latest first
    const countResult = await contactMsgModel.aggregate([
      { $count: "totalContacts" },
    ]);

    const count = countResult[0]?.totalContacts || 0;

    res.status(200).json({
      success: true,
      msg: "All messages fetched successfully",
      count,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch messages. Please try again later.",
    });
  }
};

const updatingContactStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Bad request" });
    }

    const msg = await contactMsgModel.findById(id);

    if (!msg) {
      return res.status(404).json({ success: false, message: "msg not Found" });
    }

    const currentStatus = msg.status;

    const status = ["new", "in progress", "resolved"];

    const toggleStatus = (currentStatus) => {
      const currentIndex = status.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % status.length;
      return status[nextIndex];
    };

    const newStatus = toggleStatus(currentStatus); //this will get next status

    console.log(newStatus);

    const updatedMsg = await contactMsgModel.findByIdAndUpdate(
      id,
      {
        status: newStatus,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `Msg is now set to ${newStatus}`,
      updatedMsg,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, msg: "id not provided" });
    }
    const removedmsg = await contactMsgModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Msg Removed succesfull", removedmsg });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export {
  loginAdmin,
  getAllUsers,
  deleteUser,
  updateURole,
  viewAllBlogs,
  updatingBlogStatus,
  removeBlog,
  getAllContacts,
  updatingContactStatus,
  deleteContact,
  //    dashboard  further ...
};
