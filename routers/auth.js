const router = require('express').Router();
const User = require('../models/user');
const Tokenblacklist = require('../models/tokenblacklist');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function(error) {
    console.error(error);
});


const secretkeyJWT = process.env.SECRET_KEY_JWT;
const generateJWTToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, secretkeyJWT, {expiresIn: "15 days"});
};

// login
router.post('/login', (req, res) => {
    passport.authenticate(User.createStrategy(), {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user: user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = generateJWTToken(user);
            let userLocal = JSON.parse(JSON.stringify(user));
            userLocal.token = token;
            delete userLocal.hash;
            delete userLocal.salt;
            return res.json(userLocal);
        });
    })(req, res);

});

//logout
router.post('/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    // console.log("Token: " + token);
    redisClient.rpush('token', token, function (err, result) {
        console.log("Result: "+result);
        if (result) {
            Tokenblacklist.create({token: token}, function (err, data) {
                if (data) {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'You are logged out',
                    });
                }
            });
        }
    });
});

// register User
router.post('/register', (req, res) => {
    let user = req.body;
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        active: true
    }), req.body.password, function (err, user) {
        if (!err) {
            let userLocal = JSON.parse(JSON.stringify(user));
            // console.log("User registered: " + userLocal);
            userLocal.token = generateJWTToken(userLocal);
            delete userLocal.hash;
            delete userLocal.salt;
            const token = {username: userLocal.username, token: userLocal.token, isExpired: false};
            res.send(userLocal)

        } else {
            console.log("Error: " + err);
            res.send({
                'message': err
            })
        }
    });
});

module.exports = router;