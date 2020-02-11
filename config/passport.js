const httpStatus = require('http-status');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const logger = require('./logger');
const consts = require('./consts');
// const bcrypt = require('bcrypt-nodejs');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GoogleTokenStrategy = require('passport-google-token').Strategy;


// source: https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d


passport.use(new LocalStrategy({
        usernameField: 'nickName',
    },
    (nickName, password, done) => {
        logger.info('local strategy');
        return { username: 'dummy '};
        /*
        return User.findOne({ nickName: { $regex: new RegExp(`^${nickName.toLowerCase()}`, 'i') } })
            .then((user) => {
                if (!user) {
                    return done(new APIError('Bad credentials', httpStatus.UNAUTHORIZED), null);
                }
                if (!bcrypt.compareSync(password, user.passwordHash)) {
                    return done(new APIError('Bad credentials', httpStatus.UNAUTHORIZED), null);
                }
                return done(null, user);
            })
            .catch(e => done(e, null));
         */
    },
));


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: consts.jwtSecretKey,
};
passport.use(new JWTStrategy(opts, (payload, done) => {
    return done(null, false);
    /*
    // Todo: validate JWT token is not in invalidate-blacklist
    User.findById(payload.id)
        .then((user) => {
            if (user) {
                const expirationDate = new Date(payload.exp * 1000);
                const now = new Date();
                logger.debug(`user [${payload.name}] expirationDate=[${expirationDate}] <> Date=[${new Date()}] = ${expirationDate - now}`);
                if (expirationDate - now > 0 || payload.name === 'Booli') { // Todo - remove debug jwt
                    return done(null, {
                        id: user.id,
                        name: user.nickName,
                        // email: user.email, // Todo - add
                    });
                }
            }
            return done(null, false);
        }).catch((err) => {
            logger.error(err);
            return done(null, false);
        });
     */
}));

// Todo - Should work
/*
passport.use(new GoogleTokenStrategy({
        clientID: consts.GOOGLE_CLIENT_ID,
        clientSecret: consts.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
        // Todo - Not Authorized on Dev, And was no cheked on Prod
        logger.info('************ Google passport ****************:', accessToken);
        User.findOrCreate({ googleId: profile.id }, (err, user) => {
            return done(err, user);
        });
    }
));
 */

// Todo - GoogleStrategy (passport-google-oauth) is not working. Token is not received.
/*
passport.use(new GoogleStrategy({
    clientID: consts.GOOGLE_CLIENT_ID,
    clientSecret: consts.GOOGLE_CLIENT_SECRET,
    callbackURL: consts.GOOGLE_CALLBACKP_URL,
    passReqToCallback: true,
},
    (request, accessToken, refreshToken, profile, done) => {
    // Todo - Not Authorized on Dev, And was no cheked on Prod
    logger.info('************ Google passport ****************:', accessToken);
    User.findOrCreate({ googleId: profile.id }, (err, user) => {
        return done(err, user);
    });
}));
*/



// tell passport how to serialize the user
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    return done(null, { username: 'dummy' });
    /*
    return User.get(id)
        .then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(new APIError("deserializeUser didn't find user", httpStatus.UNAUTHORIZED), null);
            }
        })
        .catch(e => done(e));
     */
});

module.exports = passport;
