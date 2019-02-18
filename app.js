var express = require('express');
var app = express();
var logger = require('morgan');
var path = require('path');
var nofavicon = require("express-no-favicons");
app.use(nofavicon());
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require("express-session");
app.use(expressSession({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}));
var passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
var mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
var routes = require('./routes/index');
var strategy = require("./config/strategy");
app.use('/', routes);
mongoose.connect("mongodb://localhost:27017/instagramDemo", function (err) {
    if (err) {
        console.log(err);
        res.status(500).send("internal server problem");
    } else
        console.log("connected");
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("public"));
/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace



module.exports = app;