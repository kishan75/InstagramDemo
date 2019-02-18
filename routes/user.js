var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/login', function (req, res, next) {
    controller.user.logIn(req, res, next);
});
router.get('/logout', function (req, res) {
    controller.user.logOut(req, res);
});
router.post('/signUp', function (req, res, next) {
    controller.user.signUp(req, res, next);
});
module.exports = router;