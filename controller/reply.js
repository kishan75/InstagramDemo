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
    }).populate('user').exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
            return;
        }
        if (result) {
            res.status(200).send(JSON.stringify({
                reply: result.reply
            }));
        } else
            res.status(404).send(JSON.stringify({
                msg: "commentId is invalid"
            }));
    });
};

collection.postReply = function (req, res) {
    console.log(req.body);
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
                    reply: result._id
                }
            }, {
                'new': true
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                } else {
                    model.Reply.findOne({
                        _id: result._id
                    }).populate('user').exec(function (err, result) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("internal server problem");
                            return;
                        }
                        res.status(200).send(JSON.stringify({
                            msg: "you replied",
                            data: response.reply,
                            reply: result
                        }));
                    });
                }
            });
        }
    });
};
collection.delete = function (req, res) {
    model.Reply.findOne({
        _id: req.params.id
    }).populate('user').populate('comment').exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else {
            if (result) {
                if (result.user.email == req.user.email) {
                    model.Comments.findByIdAndUpdate(result.comment._id, {
                        $pull: {
                            reply: req.params.id
                        }
                    }, {
                        'new': true
                    }, function (err, result) {
                        if (err) {
                            if (err) {
                                console.log(err);
                                res.status(500).send("internal server problem");
                                return;
                            }
                        } else {
                            model.Reply.findByIdAndDelete(req.params.id, function (err, response) {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send("internal server problem");
                                } else {
                                    res.status(200).send(JSON.stringify({
                                        msg: "reply deleted",
                                        data: result
                                    }));
                                }
                            });
                        }
                    });
                } else {
                    res.status(404).send(JSON.stringify({
                        msg: "you can delete only your own replies"
                    }));
                }
            } else {
                res.status(404).send(JSON.stringify({
                    msg: "reply id is invalid"
                }));
            }
        }

    });
};
module.exports = collection;