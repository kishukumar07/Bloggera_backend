import mongoose from 'mongoose';


const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: { //added for relation ship b/w blog with author    
        type: String,
        required: true,
    },
    authorID: { //added for relation ship b/w blog with author 
        type: String,
        require: true
    },
    category: {
        type: String,
        required: true,
    }, 
}, {
    versionKey: false
} )


export const Blogmodel = mongoose.model("blog", blogSchema)





  // slug: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     lowercase: true,
    // },
 // tags: [
    //     {
    //         type: String,
    //     },
    // ],
    // featuredImage: {
    //     type: String, // URL of the image
    // },
    // likes: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User',
    //     },
    // ],
    // comments: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Comment',
    //     },
    // ],
    // views: {
    //     type: Number,
    //     default: 0,
    // },
    // status: {
    //     type: String,
    //     enum: ['draft', 'published'],
    //     default: 'draft',
    // },
    // publishedAt: {
    //     type: Date,
    // },
// },{
//         timestamps: true
//     }, 