const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


mongoose.set("strictQuery", false);
const connection = mongoose.connect(process.env.url)



module.exports = {
      connection
}
 