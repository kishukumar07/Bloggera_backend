const mongoose = require('mongoose')


const blogSchema = mongoose.Schema()



const Blogmodel = mongoose.model("blog", blogSchema)

module.exports = {
    Blogmodel
}