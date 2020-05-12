const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    facebook: String,
    firstname: String,
    lastname: String,
    fullname: String,
    email: String,
    image: {
        type: String,
        default: '/img/user.png'
    },
    city: String,
    country: String,
    online: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        default: 0
    },
    password: String
});
userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
module.exports = mongoose.model('User2', userSchema);
