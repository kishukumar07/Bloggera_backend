
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
dotenv.config();
import { userRoutes } from "./controllers/user.js";
import { blogRoutes } from "./controllers/blog.js";
import { auth } from "./middlewares/auth.js";
import { connection } from "./db.js";






// //for swagger purpose
// const  swaggerJSdoc =require('swagger-jsdoc'); 
// const swaggerUi = require("swagger-ui-express"); 



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





//swagger part below 
// app.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

//swagger part above  



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