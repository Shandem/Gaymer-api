const db = require('../models')

const index = (req, res) => {
    db.Post.find({}, (err, foundPosts) => {
        if (err) console.log('Error in posts#index:', err)
        
        if(!foundPosts) return res.json({
            message: 'No posts found in database.'
        })

        res.status(200).json({ posts: foundPosts });
    })
}


const create = (req, res) => {
    db.Post.create(req.body, (err, savedPost) => {
        if (err) console.log('Error in posts#create:', err)

        // Validations and error handling here

        res.status(200).json({ post: savedPost })
    })
}

const update = (req, res) => {
    const options = { new: true }
    console.log(req.params.id)
    db.Post.findByIdAndUpdate(req.params.id, req.body, options, (err, updatedPost) => {
        if (err) console.log('Error in posts#update:', err)
        if (!updatedPost) return res.json({
            message: "No post with that ID found."
        })

        // Validations and error handling here

        res.status(200).json({ post: updatedPost })
    })
}

const destroy = (req, res) => {
    db.Post.findByIdAndDelete(req.params.id, (err, deletedPost) => {
        if (err) console.log('Error in posts#destroy:', err)
        if (!deletedPost) return res.json({
            message: "No post with that ID found."
        })

        res.status(200).json({ post: deletedPost })
    })
}


module.exports = {
    index,
    create,
    update,
    destroy
}