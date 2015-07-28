'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var User = new mongoose.Schema({
    name: {
      type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    input: {
      type: Array,
      default: []
    },
    // output: reviews, likes, wish list, etc.
    // helpful for building recommendation engine down the line
    ouput: {
      type: Array,
      default: []
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Number
    },
    paymentInformation: {
      type: Array,
      default: []
    },
    addresses: {
      type: Array,
      default: []
    }
});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

User.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

User.statics.generateSalt = generateSalt;
User.statics.encryptPassword = encryptPassword;

User.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', User);
