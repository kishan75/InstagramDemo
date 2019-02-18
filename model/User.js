const mongoose = require("mongoose");
const schema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});
module.exports = mongoose.model("User", schema);