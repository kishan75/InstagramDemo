const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const model = require("../model/index");
const bcrypt = require("bcrypt");

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    model.User.findById(id, function (err, res) {
        if (err)
            {
                console.log(err);
                res.status(500).send("internal server problem");
            }
        if (res)
            return done(null, res);
    });
});
passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    function (username, password, done) {
        model.User.findOne({
            email: username
        }, function (err, user) {
            if (err) {
                {
                console.log(err);
                res.status(500).send("internal server problem");
            }
            }
            if (!user) {
                return done(null, false);
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }));