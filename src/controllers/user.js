import express from "express";
import { Usermodel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlacklistModel } from "../models/blacklist.js";
import axios from "axios";

dotenv.config();

const userRoutes = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account. All fields (Name, Email, Password, Age, and City) are required.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - age
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               age:
 *                 type: number
 *                 description: User's age
 *               city:
 *                 type: string
 *                 description: User's city
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */

userRoutes.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // console.log(email, password, name)
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required: Name, Email, Password",
      });
    }

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, msg: "User already exists." });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, msg: "Internal server error." });
      }
      try {
        const user = new Usermodel({ name, email, password: hash });
        await user.save();

        res
          .status(201)
          .json({ success: true, msg: "User registered successfully!" });
      } catch (err) {
        res.status(500).json({
          success: false,
          msg: "Internal server error.",
          error: err.message,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal server error.",
      error: err.message,
    });
  }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns JWT tokens
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Login Successful
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 reftoken:
 *                   type: string
 *                   description: JWT refresh token
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

userRoutes.post("/login", async (req, res) => {
  // Finding the user with email
  const { email, password } = req.body;
  // console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required: email, password",
    });
  }

  try {
    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Wrong credentials." });
    }

    const hashedPassword = user.password;

    bcrypt.compare(password, hashedPassword, (err, result) => {
      // Can also use this with await keyword, no need for a callback
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

      // Returning response with token

      const token = jwt.sign(
        { authorID: user._id, author: user.name },
        process.env.jwtSecretKey,
        { expiresIn: "1h" }
      );

      // Create refresh token
      const reftoken = jwt.sign(
        { authorID: user._id, author: user.name },
        process.env.REF_SECRET,
        {
          expiresIn: "7h",
        }
      );

      res
        .status(200)
        .json({ success: "true", msg: "Login Sucessful", token, reftoken });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     description: Blacklists the current JWT token
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */
//Logout user and blacklist token
userRoutes.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const BlacklistedToken = new BlacklistModel({ token });
    await BlacklistedToken.save();
    res.status(200).send("Logged out successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generate new access token using refresh token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reftoken
 *             properties:
 *               reftoken:
 *                 type: string
 *                 description: Refresh token received during login
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token
 *       401:
 *         description: Unauthorized or invalid refresh token
 */

//for ref token purpose  -using ref token we;ll generate new acesstoken
userRoutes.post("/refresh", async (req, res) => {
  const refreshToken = req.body.reftoken;
  // Verify refresh token
  try {
    const decoded = jwt.verify(refreshToken, process.env.REF_SECRET); //decoding the reftoken

    authorID = decoded.authorID;

    const user = await Usermodel.findOne({ authorID });
    if (!user) return res.status(401).send("Unauthorized login Again");

    // Generate new access token
    const token = jwt.sign(
      { authorID: user._id, author: user.name },
      process.env.jwtSecretKey,
      { expiresIn: "1h" }
    );
    // Return new access token to client
    res.json({ token });
  } catch (err) {
    res.status(401).send("Unauthorized 2");
  }
});

/**
 * @swagger
 * /user/auth/github:
 *   get:
 *     summary: GitHub OAuth Authentication
 *     description: Handles GitHub OAuth callback and returns JWT token
 *     tags:
 *       - OAuth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub OAuth code
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: OAuth error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *     security: []
 */

// //redirected to this  after o-auth
userRoutes.get("/auth/github", async (req, res, next) => {
  try {
    const { code } = req.query;
    // console.log("OAuth Code:", code);

    //step2
    const {
      data: { access_token },
    } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    //step3.
    const { data } = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Extract first email (assuming the first one is the primary email)
    const email = data.length > 0 ? data[0].email : null;

    console.log(email); //have to generate jwt using that email and send it as response ..... so that user can use that token to auth for next time .........

    var token = jwt.sign({ email }, process.env.jwtSecretKey);

    res.status(401).json({ token }); //if client will use this token for auth .. they will have acess to protect route as well ...without regestering as well
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

export { userRoutes };
