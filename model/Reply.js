const mongoose = require("mongoose");
const schema = mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    },
    reply: {
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
module.exports = mongoose.model("Reply", schema);