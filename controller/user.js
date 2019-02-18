var passport = require("passport");
var model = require("../model/index");
var bcrypt = require("bcrypt");
var joi = require("joi");

var collection = {};

collection.logIn = function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        }
        if (!user)
            return res.status(404).send(JSON.stringify({
                msg: "credentials not found"
            }));
        req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send("internal server problem");
            }
            return res.status(200).send(JSON.stringify({
                path: "/",
                msg: "logged in successfully"
            }));
        });
    })(req, res, next);
};
collection.logOut = function (req, res) {
    req.logout();
    res.status(200).redirect("/");
};
collection.signUp = function (req, res, next) {
    var validation = {
        email: joi.string().email(),
        password: joi.string().min(5).required(),
        confirmPassword: joi.any().valid(joi.ref('password')).required().options({
            language: {
                any: {
                    allowOnly: 'must match password'
                }
            }
        })
    };
    if (joi.validate(req.body, validation).error) {
        res.status(400).send(
            JSON.stringify({
                path: "/",
                msg: "invalid input format"
            }));
    } else
        model.User.findOne({
            email: req.body.email
        }, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("internal server problem");
            } else
            if (result) {
                res.status(400).send(
                    JSON.stringify({
                        path: "/",
                        msg: "email already exist"
                    }));
            } else {
                var user = new model.User({
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10)
                });
                model.User.create(user, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("internal server problem");
                    } else
                        collection.logIn(req, res, next);
                });
            }
        });

};
module.exports = collection;