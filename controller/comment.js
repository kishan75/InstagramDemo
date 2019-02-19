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
    }).populate('user').exec(function (err, result) {
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
    model.Comments.findOne({
        _id: req.params.id
    }).populate('post').populate('user').exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
            return;
        }
        if (result) {
            if (result.user.email == req.user.email) {
                var promise = new Promise(function (resolve, reject) {
                    model.Reply.deleteMany({
                        comment: req.params.id
                    }, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        model.Comments.findByIdAndDelete(req.params.id, function (err, res) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    });
                }, function (err) {
                    console.log("reject 2");
                    return Promise.reject(err);
                }).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        console.log(3);
                        model.Post.findByIdAndUpdate(result.post._id, {
                            $pull: {
                                comments: req.params.id
                            }
                        }, {
                            'new': true
                        }, function (err, response) {
                            if (err)
                                reject(err);
                            else
                                resolve(response);
                        });
                    });
                }, function (err) {
                    return Promise.reject(err);
                });
                promise.then(function (response) {
                    res.status(200).send(JSON.stringify({
                        msg: "comment deleted",
                        data: response
                    }));
                }, function (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
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
    });
};
module.exports = collection;