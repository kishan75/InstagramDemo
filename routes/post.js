var express = require('express');
var router = express.Router();
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date() + file.originalname);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/'))
            cb(null, true);
        else
            cb(null, false);
    }
});

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

router.post("/", upload.single("image"), function (req, res) {
    console.log(req.body);
    controller.post.create(req, res);
});

router.delete("/:id", function (req, res) {
    controller.post.remove(req, res);
});

module.exports = router;