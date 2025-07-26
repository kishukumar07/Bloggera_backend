import express from "express";
import { Usermodel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlacklistModel } from "../models/blacklist.js";
import axios from "axios";

dotenv.config();

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
        { expiresIn: "24h" }
      );

      // Create refresh token
      const reftoken = jwt.sign(
        { authorID: user._id, author: user.name },
        process.env.REF_SECRET,
        {
          expiresIn: "72h",
        }
      );

      res
        .status(200)
        .json({ success: "true", msg: "Login Sucessful", token, reftoken });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

//Logout user and blacklist token
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.trim().split(" ")[1];
    const BlacklistedToken = new BlacklistModel({ token });
    await BlacklistedToken.save();
    res.status(200).json({ success: true, msg: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

//for ref token purpose  -using ref token we;ll generate new acesstoken
const refresh = async (req, res) => {
  const refreshToken = req.body.reftoken;
  // Verify refresh token
  try {
    const decoded = jwt.verify(refreshToken, process.env.REF_SECRET); //decoding the reftoken

    const authorID = decoded.authorID;

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
};

//redirected to this  after o-auth
const githubOauth = async (req, res, next) => {
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

    res.redirect(
      `https://bloggera-frontend.vercel.app/dashboard?token=${token}`
    );
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export { register, login, logout, refresh, githubOauth };
