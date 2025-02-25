const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const connection = require('./db')
const cors=require('cors')
const {userRoutes}=require('./controllers/user')
const {blogRoutes}=require('./controllers/blog')

app.use(express.json())

app.use(cors())
const port = process.env.PORT ||= 8000;




app.use("/user",userRoutes)
app.use("/blog",blogRoutes)


app.listen(port, async () => {
    try {
        await connection
  
        console.log("server is live at " + port)
    } catch {
        console.log("something went wrong at connection with db ")
    }
})