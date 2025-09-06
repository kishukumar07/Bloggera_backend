import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
dotenv.config();

import userRoutes from "./src/Routes/user.route.js";
import blogRoutes from "./src/Routes/blog.route.js";
import contactRoutes from "./src/Routes/contact.route.js";
import adminroute from "./src/Routes/admin.route.js";

import { auth } from "./src/middlewares/auth.js";
import { connection } from "./src/configs/db.config.js";

// Middleware to handle JSON parsing errors
app.use(express.json());

// Custom error handler for invalid JSON input in req.body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ error: "Invalid JSON format. Please check your request body." });
  }
  next();
});

app.use(cors());
const port = (process.env.PORT ||= 8000);

app.get("/", (req, res) => {
  res.end("this is your Blog app");
});

app.use("/user", userRoutes);

app.use("/contact", contactRoutes);
//auth middle ware  -need to be modified by route
// app.use(auth);

app.use("/admin", adminroute);

app.use("/blog", blogRoutes);

app.listen(port, async () => {
  try {
    await connection;

    console.log("server is live at " + port);
  } catch {
    console.log("something went wrong at connection with db ");
  }
});
