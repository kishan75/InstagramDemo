var router = require('express').Router();

var controller = require("../controller/index");
router.use('/post', require("./post"));
router.use('/user', require("./user"));
router.use('/like', require("./like"));
router.use('/comment', require("./comment"));
router.use("/reply", require("./reply"));

router.get('/:email', function (req, res) { // get by email
    controller.post.getByEmail(req, res);
});

router.get('/', function (req, res) {
    if (req.isAuthenticated()) { // to homepage
        controller.post.getAllPost(req, res);
    } else { // to login page 
        res.render("login");
    }

});

module.exports = router;