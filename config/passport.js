var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Promise = require('promise');
var authConfig = require('./auth.js');
var db = require('./../app/db.js');
var dbMessage = require('./../app/util/dbUtil.js').dbMessage;

var passportConfig = function(passport){

    passport.serializeUser(function(user, done) {
        return done(null, user['google-id']);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.findUser(id).done(
            (res) => {
                if(res.msg !== dbMessage.USER_NOT_EXIST) {
                    return done(null, res.msg);
                } else {
                    return done(null, false);
                }
            },
            (err) => {
                return done(err);
            }
        );
    });

    passport.use(new GoogleStrategy({
        clientID: authConfig.googleAuth.clientId,
        clientSecret: authConfig.googleAuth.clientSecret,
        callbackURL: authConfig.googleAuth.callBack,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            // user is not loggined
            if(!req.user) {
                // find user
                db.findUser(profile.id).then(
                    // query returned
                    (res_find) => {
                        // user exist and not loggined
                        // renew token and update name, primary email and picture
                        if(res_find.success && res_find.msg !== dbMessage.USER_NOT_EXIST) {
                            db.makeUser(
                                profile.id, 
                                accessToken, 
                                profile.emails[0].value.toLowerCase(), 
                                profile.displayName,
                                profile.photos[0].value
                            ).then(
                                (res_make) => {
                                    if(res_make.success && res_make.msg === dbMessage.USER_MADE) {
                                        db.findUser(profile.id).then(
                                            (res_find) => {
                                                return done(null, res_find.msg);
                                            }
                                        );
                                    } else {
                                        return done(res_make.msg);
                                    }
                                },
                                (err_make) => {
                                    return done(err_make.msg);
                                }
                            );
                        }
                        // user does not exist, new user found.
                        else if(!res_find.success && res_find.msg === dbMessage.USER_NOT_EXIST) {
                            db.makeUser(
                                profile.id, 
                                accessToken, 
                                profile.emails[0].value.toLowerCase(), 
                                profile.displayName,
                                profile.photos[0].value
                            ).then(
                                (res_make) => {
                                    if(res_make.success && res_make.msg === dbMessage.USER_MADE) {
                                        db.findUser(profile.id).then(
                                            (res_find) => {
                                                return done(null, res_find.msg);
                                            }
                                        );
                                    } else {
                                        return done(res_make.msg);
                                    }
                                },
                                (err_make) => {
                                    return done(err_make.msg);
                                }
                            );
                        }
                        // db find user error
                        else {
                            return done(res_find.msg);
                        }
                    },
                    // user not found
                    (err_make) => {
                        return done(err_make.msg);
                    }
                );
            } 
            // user loggined
            else {
                //renew details and token
                db.makeUser(
                    profile.id, 
                    accessToken, 
                    profile.emails[0].value.toLowerCase(), 
                    profile.displayName,
                    profile.photos[0].value
                ).then(
                    (res_make) => {
                        if(res_make.success && res_make.msg === dbMessage.USER_MADE) {
                            db.findUser(profile.id).then(
                                (res_find) => {
                                    return done(null, res_find.msg);
                                }
                            );
                        } else {
                            return done(res_make.msg);
                        }
                    },
                    (err_make) => {
                        return done(err_make.msg);
                    }
                );
            }
        });
    }
    ));
};

module.exports = passportConfig;