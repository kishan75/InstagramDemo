var model = require("../model/index");
var joi = require("joi");
var fs = require("fs");

var collection = {};

collection.getByEmail = function (req, res) {
    model.User.findOne({
        email: req.params.email
    }).populate('post').exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            if (!result) {
                res.status(400).send("data not found");
                return;
            }
            if (req.isAuthenticated()) {
                if (req.params.email == req.user.email) {
                    res.status(200).render("profile", {
                        images: result.post,
                        email: req.user.email
                    });
                } else {
                    res.status(200).render("otherUserProfile", {
                        images: result.post,
                        personEmail: result.email,
                        email: req.user.email
                    });
                }
            } else {
                res.status(200).render("otherUserUnAuhenticated", {
                    images: result.post,
                    email: result.email
                });
            }

        }
    });
};
collection.getAllPost = function (req, res) {
    var promise = new Promise(function (resolve, reject) {
        model.Post.find().populate('user').exec(function (err, result) { // populate on post for fetch user
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
    promise.then(function (result) {
        res.status(200).render("home", {
            images: result,
            email: req.user.email
        });
    }, function (err) {
        console.log(err);
        res.status(500).send("internal server problem");
    });
};

collection.create = function (req, res) {
    console.log(req.user);
    if (req.file == undefined) {
        res.status(400).send(
            JSON.stringify({
                msg: "please select a image file"
            }));
        return;
    }
    var post = new model.Post({
        user: req.user._id,
        path: '/' + req.file.path,
    });
    model.Post.create(post, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else {
            model.User.findByIdAndUpdate(req.user._id, { // push post_id in user post array
                $push: {
                    post: result._id
                }
            }, {
                'new': true
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                } else
                    res.status(200).send(
                        JSON.stringify({
                            path: "/profile/" + req.user.email,
                        }));
            });
        }
    });
};
collection.remove = function (req, res) {
    model.Post.findById(req.params.id).populate('user').exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else
        if (result) {
            if (req.user.email == result.user.email) {
                var promise = new Promise(function (resolve, reject) {
                    model.Reply.deleteMany({
                        comment: {
                            $in: result.comment
                        }
                    }, function (err, response) {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                }).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        model.Comments.deleteMany({
                            post: req.params.id
                        }, function (err, response) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    });
                }, function (err) {
                    return Promise.reject(err);
                }).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        model.Post.findByIdAndDelete(req.params.id, function (err, response) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    });
                }, function (err) {
                    return Promise.reject(err);
                }).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        model.User.findByIdAndUpdate(result.user._id, {
                            $pull: {
                                post: req.params.id
                            }
                        }, {
                            'new': true
                        }, function (err, response) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    });
                }, function (err) {
                    return Promise.reject(err);
                }).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        fs.unlink("/home/kishan/Desktop/deqode/instagramDemo" + result.path, function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    });
                }, function (err) {
                    return Promise.reject(err);
                });
                promise.then(function (result) {
                    res.status(200).send(JSON.stringify({
                        msg: "post deleted",
                        data: result
                    }));
                }, function (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                });
            } else {
                res.status(404).send(JSON.stringify({
                    msg: "you can delete only your own post"
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