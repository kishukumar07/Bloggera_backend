import mongoose from 'mongoose';

const BlacklistSchema = mongoose.Schema({
    token: {
        type: String,
        require: true,
        unique: true,
    },
}); 

export const BlacklistModel = mongoose.model("blacklist", BlacklistSchema);


// Key changes made:

// Replaced require with import
// Changed module.exports to export const
// Removed unused TokenExpiredError import
// Modified to use ES modules export syntax