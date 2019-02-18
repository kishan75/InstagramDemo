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
                res.status(200).render("otherUserProfile", {
                    images: result.post,
                    personEmail: result.email
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
    model.Post.findById(req.params.id, function (err, response) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        } else {
            model.Post.findByIdAndDelete(req.params.id, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                } else {
                    fs.unlink("/home/kishan/Desktop/techracers/instaDemoApp" + response.image, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("internal server problem");
                        } else
                            res.status(200).send(
                                JSON.stringify({
                                    path: "/profile",
                                    msg: "data deleted successfully",
                                }));
                    });
                }
            });
        }
    });
};
module.exports = collection;