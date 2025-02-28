const express = require('express');
const userRoutes = express.Router();
const { Usermodel } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const { BlacklistModel } = require('../models/blacklist')

userRoutes.post("/register", async (req, res) => {
    try {
        const { email, password, name, age, city } = req.body;

        if (!email || !password || !name || !age || !city) {
            return res.status(400).json({ msg: "All fields are required: Name, Email, Password, Age, and City." });
        }


        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists." });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error." });
            }
            try {

                const user = new Usermodel({ name, email, "password": hash, age, city });
                await user.save();

                res.status(201).json({ msg: "User registered successfully!" });

            } catch (err) {

                res.status(500).json({ msg: "Internal server error.", error: err.message });
            }
        });

    } catch (err) {

        res.status(500).json({ msg: "Internal server error.", error: err.message });
    }
});




userRoutes.post("/login", async (req, res) => {
    // Finding the user with email
    const { email, password } = req.body;



    if (!email || !password) {
        return res.status(400).json({ msg: "All fields are required: Name, Email, Password, Age, and City." });
    }


    try {
        const user = await Usermodel.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: "Wrong credentials." });
        }

        const hashedPassword = user.password;

        bcrypt.compare(password, hashedPassword, (err, result) => { // Can also use this with await keyword, no need for a callback
            // result == true
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }

            if (!result) {
                return res.status(401).json({ msg: "Wrong credentials." });
            }

            // Returning response with token
            const token = jwt.sign({ authorID: user._id, author: user.name }, process.env.jwtSecretKey);   //have to complete this 
            res.status(200).send({ 'msg': "Login Sucessful", "token": token });

        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});




// Logout user and blacklist token
userRoutes.post("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const BlacklistedToken = new BlacklistModel({ token });
        await BlacklistedToken.save();
        res.status(200).send('Logged out successfully');
   } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
    }
});








module.exports = {
    userRoutes
};
