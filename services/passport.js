const passport = require('passport');
// The google strategy is lets passport which
//strategy it should use to attempt to get
// user information.
// This is because different companies have different
// procedures for communicating with passport.
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//mongoose is a javascript library that helps us communicate with mongodb
const mongoose = require('mongoose');
// It is good for us to keep keys in a sep. file and gitignore
const keys = require('../config/keys');

const User = mongoose.model('users');

// After the user signs up we only care about the user.id
passport.serializeUser( (user, done) => {
    done(null, user.id);
});

passport.deserializeUser( (id, done) => {
    User.findById(id)
    .then( user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id })
            .then((existingUser) => {
                if (existingUser) {
                    // we already have a record with the given profile id
                    done(null, existingUser);
                } else {
                    // we don't have a user with that profile id so lets make one!
                    new User({ googleId: profile.id })
                        .save()
                        .then(user => done(null, user));
                }
            })   
    }
));
