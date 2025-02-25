const express = require('express')
const userRoutes = express.Router()
const { Usermodel } = require('../models/user')
const bcrypt = require('bcrypt')


userRoutes.post("/register", async (req, res) => {
    try {
        const { email, password, name, age, city } = req.body;

        // Check if all fields are provided
        if (!email || !password || !name || !age || !city) {
            return res.status(400).json({ msg: "All fields are required: name, email, password, age, and city." });
        }

        // Check if user already exists
        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists" });
        }

        //hashing password with bcrypt -sequrity feature  
        bcrypt.hash(password, 5, async (err, hash) => {
            // Store hash in your password DB.
            // Create new user
            const user = new Usermodel({ name, email, "password": hash, age, city });
            await user.save();
        });

        res.status(201).json({ msg:"User registered successfully!" });

    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
});









userRoutes.post("/login", (req, res) => {
    //logicwill be here 
    res.send("login route ")


})





module.exports = {
    userRoutes
}