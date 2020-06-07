const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    token: {type: String, required: true}
});
const Tokenblacklist = mongoose.model('tokenblacklist', schema);
module.exports = Tokenblacklist;