mongoose = require('./connect');

// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

/**
 * User
 * @requires connect
 * @requires mongoose
 * @requires bcrypt-nodejs
 * @typedef {Object} User
 * @property {string} google.id - google id for the current user
 * @property {string} google.token - google token for the current user
 * @property {string} google.email - google email array for the current user
 * @property {string} google.name - google name for the current user
 * 
 * @property {string} photo.type - profile photo url for the current user
 * @property {number} role - role assigned to the current user inside the app. "reviewer" as default
 */
var userSchema = mongoose.Schema({

    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        default:"reviewer"
    }

});
 
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// This function checks if the google oauth password is valid.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);