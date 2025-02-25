const express = require('express')
const userRoutes = express.Router()
const { Usermodel } = require('../models/user')



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

        // Create new user
        const user = new Usermodel(req.body);
        await user.save();

        
        res.status(201).json({ msg: "User registered successfully!" });

    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
});




userRoutes.post("/login", async (req, res) => {

    const users = await Usermodel.find({})
    res.send(users)

})



// userRoutes.POST()




module.exports = {
    userRoutes
}