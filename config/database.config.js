require('dotenv').config();

const DB_URL = process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;

module.exports = {
    url: 'mongodb://'+DB_URL
};