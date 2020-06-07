const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now},
    active: {type: Boolean}
});
userSchema.index({name: 1, email: 1});
userSchema.set('toObject', {
    virtuals: true, versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
    }
});
userSchema.set('toJSON', {
    virtuals: true, versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
    }
});
userSchema.plugin(mongoosePaginate);
userSchema.plugin(passportLocalMongoose, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
    usernameUnique: false,

    findByUsername: function(model, queryParameters) {
        // Add additional query parameter - AND condition - active: true
        queryParameters.active = true;
        return model.findOne(queryParameters);
    }
});
const User = mongoose.model('user', userSchema);
User.paginate().then({});
module.exports = User;