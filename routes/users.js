var express = require('express');
var router = express.Router();

var Users = require('../models/Users.js');

/* GET /user listing. */
router.get('/', function(req, res, next) {
    Users.find(function(err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

/* POST /user */
router.post('/', function(req, res, next) {
    var newUser = new Users({
        //need to add an email here 
        fullname: req.body.fullname,
        personal: {
            address: req.body.personal.address,
            address2: req.body.personal.address2,
            city: req.body.personal.city,
            email: req.body.personal.email,
            phone: {
                number: req.body.personal.phone.number,
                type: req.body.personal.phone.type
            }
        },
        office: {
        		name: req.body.office.name,
            address: req.body.office.address,
            address2: req.body.office.address2,
            city: req.body.office.city,
            email: req.body.office.email,
            phone: {
                number: req.body.office.phone.number,
                type: req.body.office.phone.type
            }
        }
    });

    newUser.save(function(err, post) {
        if (err) return next(err);
        // res.json(post);

        Users.find(function(err, users) {
            if (err) return next(err);
            res.json(users);
        });
    });
});

/* GET /user/id */
router.get('/:id', function(req, res, next) {
    Users.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /user/:id */
router.put('/:id', function(req, res, next) {
    Users.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        
        Users.find(function(err, users) {
            if (err) return next(err);
            res.json(users);
        });
    });
});

/* DELETE /user/:id */
router.delete('/:id', function(req, res, next) {
    Users.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);

        Users.find(function(err, users) {
            if (err) return next(err);
            res.json(users);
        });
    });
});

module.exports = router;
