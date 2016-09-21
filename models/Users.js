var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        default: null
    },
    personal: {
        address: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        email: Array,
        phone: Array
    },
    office: Array,
    family: Array
});

module.exports = mongoose.model('User', UserSchema);
