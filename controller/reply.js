var model = require("../model/index");

var collection = {};

collection.getAllRepliesByCommentId = function (req, res) {
    model.Comments.findOne({
        _id: req.params.commentId
    }).populate({
        path: 'reply',
        populate: {
            path: 'user'
        }
    }).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
            return;
        }
        if (result) {
            res.status(200).send(JSON.stringify({
                reply: result
            }));
        } else
            res.status(404).send(JSON.stringify({
                msg: "commentId is invalid"
            }));
    });
};

collection.postReply = function (req, res) {
    if (!req.body.reply) {
        res.status(400).send(JSON.stringify({
            msg: "reply can't be empty"
        }));
        return;
    }
    var reply = new model.Reply({
        comment: req.params.commentId,
        reply: req.body.reply,
        user: req.user._id
    });
    model.Reply.create(reply, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else {
            model.Comments.findByIdAndUpdate(req.params.commentId, { // push post_id in user post array
                $push: {
                    comments: result._id
                }
            }, {
                'new': true
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                } else {
                    res.status(200).send(
                        JSON.stringify({
                            msg: "you replied",
                        }));
                }
            });
        }
    });
};

module.exports = collection;