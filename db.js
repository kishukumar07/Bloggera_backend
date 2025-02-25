const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


// mongoose.set("strictQuery", false);   //if uncomment it will not going to save anything in db if not deppreciation warning is there  
const connection = mongoose.connect(process.env.URL)



module.exports = {
      connection
}
 