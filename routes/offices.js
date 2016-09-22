var express = require('express');
var router = express.Router();

var Users = require('../models/Users.js');
// var Office = require('../models/Office.js');

// Generate random ID
var shortid = require('shortid');

/* GET /office listing. */
router.get('/user/:id', function(req, res, next) {
    Office.find(function(err, offices) {
        if (err) return next(err);
        res.json(offices);
    });
});

/* POST /office */
router.post('/', function(req, res, next) {
    var uid = shortid.generate();

    // Validating
    var newOffice = {
        id: uid,
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        email: req.body.email,
        phone: req.body.phone,
        url: req.body.url
    };

    Users.findByIdAndUpdate(req.body.userid, {
        $push: {
            office: newOffice
        }
    }, function(err, post) {
        if (err) return next(err);

        Users.find(function(err, users) {
            if (err) return next(err);
            res.json(users);
        });
    });
});

/* DELETE /:id */
router.delete('/:userId/:officeId', function(req, res, next) {
    Users.findByIdAndUpdate(req.params.userId, {
        $pull: {
            office: {
                id: req.params.officeId
            }
        }
    }, function(err, post) {
        if (err) return next(err);

        Users.find(function(err, users) {
            if (err) return next(err);
            res.json(users);
        });
    });
});

module.exports = router;
