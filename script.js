const express = require('express')
const dotenv = require('dotenv');
const connection = require('./db')
const cors=require('cors')

dotenv.config();
const app = express()

app.use(express.json())
app.use(cors())



const port = process.env.PORT ||= 8000;
// console.log(connection)



app.listen(port, async () => {
    try {
        await connection
        console.log("server is live at " + port)
    } catch {
        console.log("something went wrong at connection with db ")
    }
})