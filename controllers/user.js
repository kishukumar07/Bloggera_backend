const express = require('express');
const userRoutes = express.Router();
const { Usermodel } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv'); 
dotenv.config()


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

    try {
        const user = await Usermodel.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: "Wrong credentials." });
        }

        const hashedPassword = user.password;

        bcrypt.compare(password, hashedPassword, (err, result) => { // Can also use this with await keyword, no need for a callback
            // result == true
            if (err) {
                return res.status(500).json({ msg: "Internal server error." });
            }

            if (!result) {
                return res.status(401).json({ msg: "Wrong credentials." });
            }

            // Returning response with token
            const token = jwt.sign({ foo: 'bar' }, process.env.jwtSecretKey);
            res.status(200).send("Login successful.");

        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = {
    userRoutes
};
