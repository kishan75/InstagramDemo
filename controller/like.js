var model = require("../model/index");

var collection = {};

collection.likeOrUnlike = function (req, res) {
    model.Post.findOne({
        _id: req.params.id,
        like: req.user.email
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("internal server problem");
        }
        if (result) {
            model.Post.findByIdAndUpdate(req.params.id, {
                $pull: {
                    like: req.user.email
                }
            }, {
                'new': true
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                } else
                    res.status(200).send(JSON.stringify({
                        user: response.like
                    }));

            });
        } else {
            model.Post.findByIdAndUpdate(req.params.id, {
                $push: {
                    like: req.user.email
                }
            }, {
                'new': true
            }, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(500).send("internal server problem");
                } else
                    res.status(200).send(JSON.stringify({
                        user: response.like
                    }));
            });
        }
    });
};

module.exports = collection;