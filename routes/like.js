var router = require('express').Router();
var controller = require("../controller/index");

router.use(function (req, res, next) {
    if (req.isAuthenticated())
        next();
    else {
        res.status(401).send(JSON.stringify({
            path: "/",
            msg: "you have to login first"
        }));
    }
});

router.get('/:id', function (req, res) {
    controller.like.likeOrUnlike(req, res);
});

module.exports = router;