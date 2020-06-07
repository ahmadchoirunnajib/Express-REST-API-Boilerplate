const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function(error) {
    console.error(error);
});

//validate jwt token, is valid or not (user performs logout)
module.exports = function (req, res, next) {
    // grab authentication token from req header
    const token = req.headers.authorization.split(' ')[1]|| req.params.token;
    // look up the token on redis
    redisClient.lrange('token', 0, 99999, function (err, result) {
        if(result.indexOf(token) > -1) {
            return res.status(400).json({
                status: 400,
                error: 'Invalid Token'
            })
        } else {
            next()
        }
    });
};