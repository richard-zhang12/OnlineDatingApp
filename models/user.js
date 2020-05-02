const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    facebook: String,
    firstname: String,
    lastname: String,
    fullname: String,
    image: String,
    email: String,
    city: String,
    country: String,
    online: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);
