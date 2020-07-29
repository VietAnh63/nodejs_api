const User = require("../models/User");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const config = require("config");
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authentication"),
    secretOrKey: config.get("jsonwebtoken.JWT_SECRET"),
};

//passport-jwt
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

//passport-local
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
