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
        address2: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        phone: {
            number: {
                type: String,
                default: null
            },
            type: {
                type: String,
                default: null
            }
        }
    },
    office: {
        name: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        address2: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        phone: {
            number: {
                type: String,
                default: null
            },
            type: {
                type: String,
                default: null
            }
        }
    },
    family: Array
});

module.exports = mongoose.model('User', UserSchema);
