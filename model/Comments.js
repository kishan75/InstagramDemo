const mongoose = require("mongoose");
const schema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    reply: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    comment: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
module.exports = mongoose.model("Comments", schema);