const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const connection = require('./db')
const cors=require('cors')
const {userRoutes}=require('./controllers/user')
const {blogRoutes}=require('./controllers/blog')
const {auth} =require('./middlewares/auth')


app.use(express.json())



// Middleware to handle JSON parsing errors
// Custom error handler for invalid JSON input in req.body
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON format. Please check your request body." });
    }
    next(); // Pass to next middleware
});






app.use(cors())
const port = process.env.PORT ||= 8000;




app.use("/user",userRoutes)





//auth middle ware 
app.use(auth)


app.use("/blog",blogRoutes)


app.listen(port, async () => {
    try {
        await connection
  
        console.log("server is live at " + port)
    } catch {
        console.log("something went wrong at connection with db ")
    }
})