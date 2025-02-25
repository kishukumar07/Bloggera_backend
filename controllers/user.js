const express = require('express')
const userRoutes = express.Router()
const { Usermodel } = require('../models/user')




userRoutes.post("/register", async (req, res) => {
    const { email,password ,name ,age ,city } = req.body

    if (!email || !password || !name || !age || !city) {
        return res.status(400).send({ msg: "All fields are required: name, email, password, age, and city." });
    }
    


    try{
        const users = await Usermodel.aggregate([{ $match: { email } }])  
        if (users.length) {
           return   res.status(409).json({ msg: "User already exists"});
        }


            try {
                const user = new Usermodel(req.body)
                await user.save();
                res.status(200).json("user registered Sucessfull")

            } catch (err) {
                res.status(400).send({ "msg": err.message })
            }
    }catch(err){
        res.status(400).json({"msg": err.message })
    }
    

})







userRoutes.post("/login", async (req, res) => {

    const users = await Usermodel.find({})
    res.send(users)

})



// userRoutes.POST()




module.exports = {
    userRoutes
}