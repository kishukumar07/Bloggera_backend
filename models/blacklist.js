const { TokenExpiredError } = require('jsonwebtoken')
const mongoose = require('mongoose')


const BlacklistSchema = mongoose.Schema({
    token: {
        type: String,
        require: true,
        unique: true,
    },
}); 


const BlacklistModel = mongoose.model("blacklist" ,BlacklistSchema)


module.exports={
    BlacklistModel
}