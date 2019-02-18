var router = require('express').Router();

var controller = require("../controller/index");

router.get("/:postId", function (req, res) { //get all  comment from an  image 
    controller.comment.getCommentByPostId(req, res);
});
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

router.post("/:postId", function (req, res) {
    controller.comment.postComment(req, res);
});

router.delete("/:id/:childId", function (req, res) {
    controller.comment.deleteComment(req, res);
});

module.exports = router;