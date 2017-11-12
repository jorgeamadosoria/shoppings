var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../data/user');

/**
 * @fileOverview Google OAuth configuration
 *
 * @requires passport-google-oauth
 * @requires data/user
 * @exports module
 */
module.exports = function(passport) {

    // load the auth variables
    var configAuth = {
    
        'googleAuth': {
            'clientID': process.env.GOOGLEAUTH_CLIENTID,
            'clientSecret': process.env.GOOGLEAUTH_CLIENTSECRET,
            'callbackURL': process.env.GOOGLEAUTH_CALLBACKURL,
            'realm': process.env.GOOGLEAUTH_REALM
        }
    
    };


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /**
     * This function authenticates an users by their Google OAuth credentials. If the user logs in for the first time, a record is created on the database for them. This allows later change of role.
     *
     * @param {string} token - google OAuth token
     * @param {string} refreshToken - google OAuth refresh token
     * @param {Object} profile - google profile scope object
     * @param {function} done - authentication callback to verify users
     * @return {User} the authenticated user or an error message if authentication fails
     *
     */
    function userCallback(token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.findOne({ 'google.id': profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();

                    // set all of the relevant information
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.photo = profile.photos[0].value;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }

    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            realm: configAuth.googleAuth.realm
        },userCallback
        ));

};