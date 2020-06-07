const router = require('express').Router();
const User = require('../models/user');
require('dotenv').config();
const passport = require('passport');

const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function(error) {
    console.error(error);
});

// Memanggil User
router.post('/all', (req, res) => {
    User.paginate({}, {page: req.body.page, limit: req.body.limit, sort: req.body.sort})
        .then(result => res.send(result.docs))
});

// call current User
router.post('/me', (req, res) => {
    User.findById(req.user.id)
        .then(data => res.send(data))
});

//change password
router.post('/changePassword', (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    // console.log("Old: "+oldPassword+" - new: "+newPassword);
    User.findById(req.user.id, function (err, user) {
        if (user) {
            user.changePassword(oldPassword, newPassword, function (err, result) {
                if (!err) {
                    // console.log("Result: "+result);
                    res.status(200).json({
                        status: 200,
                        'message': "Success. Password was changed."
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        'message': err
                    });
                }
            })
        } else {
            res.status(200).json({
                status: 200,
                'message': err
            });
        }
    });
});

//edit user
router.put('/edit/:id', (req, res) => {
    User.findByIdAndUpdate({_id: req.params.id}, {
        $set:
            {
                name: req.body.name,
                email: req.body.email,
                active: req.body.active
            }
    })
        .then(data => {
            User.find({email: req.body.email})
                .then(data => res.send(data))
        })
});

// delete User
router.delete('/:id', (req, res) => {
    const id = req.user.id;
    User.findByIdAndRemove(id)
        .then(data => res.status(200).json({
            status: 200,
            'message': "Success. User was deleted."
        }))
});

module.exports = router;