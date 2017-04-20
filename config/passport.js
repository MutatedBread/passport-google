var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var authConfig = require('./auth');

var passportConfig = function(passport){

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: authConfig.googleAuth.clientId,
        clientSecret: authConfig.googleAuth.clientSecret,
        callbackURL: authConfig.googleAuth.callBack
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
        });
    }
    ));
};

module.exports = passportConfig;
