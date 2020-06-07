const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const passport = require('passport');
const userRouter = require('./routers/user');
const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
const validateToken = require('./middleware/tokenValidation');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();


mongoose.Promise = global.Promise;

// connect to db
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("Database is connected");
    }).catch(err => {
    console.log('Error. Database is not connected');
    process.exit();
});

require('./passport');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api/index/', indexRouter);
app.use('/api/auth/', authRouter);
app.use('/api/user/', [passport.authenticate('jwt', {session: false}), validateToken], userRouter);
app.get('/', (req, res) => {
    res.json({"message": "Welcome to REST API Boilerplate: Express, Mongoose, and Passport Authentication"});
});

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

