const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(password) {
            if (!validator.isLength(password, { min: 6, max: 20 })) {
                throw new Error('Password must have length 6 - 20');
            }

            if (password.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word Password');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is Invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(age) {
            if (age < 0) {
                throw new Error('Age must be a Positive Number');
            }
        }
    }
});

module.exports = User;
