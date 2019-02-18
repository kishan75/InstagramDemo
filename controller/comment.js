var collection = {};
var model = require("../model/index");
var mongoose = require("mongoose");

collection.getCommentByPostId = function (req, res) {
    model.Post.findOne({
        _id: req.params.postId
    }).populate({
        path: 'comments',
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
                comments: result.comments
            }));
        } else
            res.status(404).send(JSON.stringify({
                msg: "postId is invalid"
            }));
    });
};
collection.postComment = function (req, res) {
    if (!req.body.comment) {
        res.status(400).send(JSON.stringify({
            msg: "comment can't be empty"
        }));
        return;
    }
    var comment = new model.Comments({
        post: req.params.postId,
        comment: req.body.comment,
        user: req.user._id
    });
    model.Comments.create(comment, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else {
            model.Post.findByIdAndUpdate(req.params.postId, { // push post_id in user post array
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
                    model.Comments.findOne({
                        _id: result._id
                    }).populate('user').exec(function (err, result) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("internal server problem");
                            return;
                        }
                        res.status(200).send(JSON.stringify({
                            msg: "you commented",
                            data: response.comments,
                            comment: result
                        }));
                    });
                }
            });
        }
    });
};

collection.deleteComment = function (req, res) {
    model.Post.findById(req.params.id, function (err, getResult) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        }
        if (!getResult) {
            res.status(400).send(JSON.stringify({
                msg: "invalid params"
            }));
            return;
        }
        var commentDocument = {};
        getResult.comment.forEach(element => {
            if (element._id == req.params.childId) {
                commentDocument = element;
                return;
            }
        });
        if (commentDocument == {}) {
            res.status(400).send(JSON.stringify({
                msg: "invalid params"
            }));
        } else {
            if (req.user.email == getResult.email || req.user.email == commentDocument.email) {
                model.Post.findByIdAndUpdate(req.params.id, {
                    $pull: {
                        comment: {
                            _id: commentDocument._id
                        }
                    }
                }, function (err, respon) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("internal server problem");
                    } else
                        model.Post.findById(req.params.id, function (err, response) {
                            if (err) {
                                console.log(err);
                                res.status(500).send("internal server problem");
                            } else
                                res.status(200).send(JSON.stringify({
                                    comment: response.comment
                                }));
                        });
                });

            } else {
                res.status(400).send(JSON.stringify({
                    msg: "you can delete only your own document"
                }));
            }

        }
    });
};
module.exports = collection;