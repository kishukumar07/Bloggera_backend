const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()




const connection = mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  }).then(() => {
      console.log('Connected to MongoDB: blogAppdb');
  }).catch(err => {
      console.error('MongoDB Connection Error:', err);
  });



module.exports = {
      connection
}
 