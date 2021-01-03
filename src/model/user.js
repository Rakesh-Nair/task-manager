const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
                //throw new Error('Password must have length 6 - 20');
            }

            if (password.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word Password');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//Find User by Credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

//Hide User Details

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

//Generate JWT
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'MY_SECRET_STRING');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//Hashing the Plain text
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
