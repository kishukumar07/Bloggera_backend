import mongoose from 'mongoose';

const BlacklistSchema = mongoose.Schema({
    token: {
        type: String,
        require: true,
        unique: true,
    },
}); 

export const BlacklistModel = mongoose.model("blacklist", BlacklistSchema);

