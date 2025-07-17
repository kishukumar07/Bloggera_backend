import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
dotenv.config();
import { userRoutes } from "./src/controllers/user.js";
import { blogRoutes } from "./src/controllers/blog.js";
import { auth } from "./src/middlewares/auth.js";
import { connection } from "./src/configs/db.js";

// //for swagger purpose
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

app.use(express.json());

// Middleware to handle JSON parsing errors
// Custom error handler for invalid JSON input in req.body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ error: "Invalid JSON format. Please check your request body." });
  }
  next(); // Pass to next middleware
});

app.use(cors());
const port = (process.env.PORT ||= 8000);

// Swagger Configuration
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Blog API Documentation",
    version: "1.0.0",
    description: "API documentation for Blog application",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}`,
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./controllers/*.js"], // Point to your route files
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger UI endpoint
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.end("this is your Blog app");
});

app.use("/user", userRoutes);

//auth middle ware
app.use(auth);

app.use("/blog", blogRoutes);

app.listen(port, async () => {
  try {
    await connection;

    console.log("server is live at " + port);
  } catch {
    console.log("something went wrong at connection with db ");
  }
});
