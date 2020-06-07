const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require('dotenv').config();

const secretkeyJWT = process.env.SECRET_KEY_JWT;

passport.use(User.createStrategy(), function (username, password, done) {
    // console.log("username: " + username + " - password: " + password);
    User.findOne({username: username}).select('+password').exec(function (err, user) {
        // console.log("User: " + user);
        if (err) {
            console.log("Eror: "+ err);
            return done(err);
        }
        if (!user) {
            console.log("Eror !user");
            return done(null, false, "User or password is not match");
        }
        user.verifyPassword(password, function (err, result) {
            if (result) {
                return done(null, user);
            } else {
                return done(null, false, "User or password is not match");
            }
        })

    });
});

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretkeyJWT
    },
    function (jwtPayload, cb) {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        /*return User.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });*/
        return cb(null, jwtPayload);
    }
));