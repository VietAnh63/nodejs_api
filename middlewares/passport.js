const User = require("../models/User");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const config = require("config");
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authentication"),
    secretOrKey: config.get("jsonwebtoken.JWT_SECRET"),
};

//passport-jwt use for secret, (bo giai ma cho token)
passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const userId = jwt_payload.subject;
            const user = await User.findById(userId);

            if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

//passport-google
passport.use(
    new GooglePlusTokenStrategy(
        {
            clientID: config.get("auth.google.CLIENTID"),
            clientSecret: config.get("auth.google.CLIENTSECRET"),
        },
        async function (accessToken, refreshToken, profile, done) {
            console.log("profile", profile);
            try {
                //Check user exists
                //profile has infor of user signIn with Oauth google with a id
                const existsUser = await User.findOne({
                    authGoogleId: profile.id,
                    authType: "google",
                });
                if (existsUser) {
                    return done(null, existsUser);
                }
                // if new account
                const newUser = new User({
                    authType: "google",
                    authGoogleId: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                });
                await newUser.save();
                //console.log(newUser);
                done(null, newUser);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
//passport-facebook
passport.use(
    new FacebookTokenStrategy(
        {
            clientID: config.get("auth.facebook.CLIENTID"),
            clientSecret: config.get("auth.facebook.CLIENTSECRET"),
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const existsUser = await User.findOne({
                    authFacebookId: profile.id,
                    authType: "facebook",
                });
                if (existsUser) {
                    return done(null, existsUser);
                }
                // if new account
                const newUser = new User({
                    authType: "facebook",
                    authFacebookId: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                });
                await newUser.save();
                //console.log(newUser);
                done(null, newUser);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

//passport-local use for signin
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async function (email, password, done) {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false);
                } else {
                    const isCorrectPassword = await user.isValidPassword(
                        password
                    );
                    if (!isCorrectPassword) {
                        return done(null, false);
                    } else {
                        //done -> push user to req (request)
                        return done(null, user);
                    }
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
