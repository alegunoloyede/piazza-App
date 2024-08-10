const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required:true
    },
    timestamp:{
        type:Date,
       Default:Date.Now
    },
   commentBody:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Comment',commentSchema)