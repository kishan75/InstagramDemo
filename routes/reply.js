var router = require('express').Router();

var controller = require("../controller/index");

router.get("/:commentId", function (req, res) { //get all  replies from an  comment 
  controller.reply.getAllRepliesByCommentId(req, res);
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

router.post("/:commentId", function (req, res) {
  controller.reply.postReply(req, res);
});

router.delete("/:id", function (req, res) {
  controller.reply.delete(req, res);
});

module.exports = router;