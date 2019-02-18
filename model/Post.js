const mongoose = require("mongoose");
const schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    path: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    like: [{
        type: String
    }]
});
module.exports = mongoose.model("Post", schema);