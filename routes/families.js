var express = require('express');
var router = express.Router();

var Users = require('../models/Users.js');
// var Families = require('../models/Families.js');

// Generate random ID
var shortid = require('shortid');

/* GET /office listing. */
router.get('/user/:id', function(req, res, next) {
    Families.find(function(err, families) {
        if (err) return next(err);
        res.json(families);
    });
});

/* POST /office */
router.post('/', function(req, res, next) {
    var uid = shortid.generate();

    // Validating
    var newFamilies = {
        id: uid,
        fullname: req.body.fullname,
        address: req.body.address,
        city: req.body.city,
        email: req.body.email,
        phone: req.body.phone,
        url: req.body.url
    };

    Users.findByIdAndUpdate(req.body.userid, {
        $push: {
            family: newFamilies
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
router.delete('/:userId/:familyId', function(req, res, next) {
    Users.findByIdAndUpdate(req.params.userId, {
        $pull: {
            family: {
                id: req.params.familyId
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
