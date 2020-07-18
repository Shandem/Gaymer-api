const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        default: 1,
        max: 100
    },
    xboxUn:{
        type: String
    },
    nesUn:{
        type: String
    },
    psUn:{
        type: String
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post;