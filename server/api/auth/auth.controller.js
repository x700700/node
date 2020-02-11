const _ = require('lodash');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const logger = require('../../../config/logger');
const APIError = require('../../../config/APIError');
const passport = require('../../../config/passport');
const consts = require('../../../config/consts');


// eslint-disable-next-line no-unused-vars
exports.check = (req, res, next) => {
    const { user } = req;
    return res.json(user);
};

exports.login = (req, res, next) => {
    logger.info('login');
    // eslint-disable-next-line consistent-return
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err) {
            req.logout();
            logger.error(err);
            return res.status(httpStatus.UNAUTHORIZED).send(err.message);
        }
        if (!user) {
            logger.error('no user found');
            return res.status(httpStatus.UNAUTHORIZED).send('Missing user credentials');
        }
        req.login(user, { session: false }, (error) => {
            if (error) {
                req.logout();
                logger.error(error);
                return res.status(httpStatus.UNAUTHORIZED).send(error);
            }
            // Todo - make dev constant payload
            const payload = {
                id: user.id,
                name: user.nickName,
            };
            return jwt.sign(payload, consts.jwtSecretKey, { expiresIn: 24 * 60 * 60 }, // Todo - jwt revoke time
                (jwtError, token) => {
                    if (jwtError) {
                        return res.status(httpStatus.UNAUTHORIZED).send(jwtError);
                    }
                    return res.json({
                        user: user.toObj(),
                        token: token,
                    });
                });
        });
    })(req, res, next);
};


exports.logout = (req, res) => {
    req.logout();
    // Todo: Invalidate JWT token by adding it to blacklist
    return res.json({ status: 'OK' });
};

/*
exports.logoutGoogle = (req, res) => {
    // Todo - Never Tested.
    req.logout();
    req.session = null;
    res.redirect('/');
};
*/


exports.changePassword = (req, res, next) => {
    const { nickName, oldPassword, newPassword } = req.body;
    const { user } = req;
    if (!user) {
        throw new APIError('no authenticated user', httpStatus.UNAUTHORIZED);
    }
    if (user.nickName !== nickName) {
        throw new APIError('Bad Credentials', httpStatus.UNAUTHORIZED);
    }
    if (!bcrypt.compareSync(oldPassword, user.passwordHash)) {
        throw new APIError('Bad Credentials', httpStatus.UNAUTHORIZED);
    }
    // eslint-disable-next-line no-param-reassign
    user.passwordHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);
    return user.save()
        .then(savedUser => res.json(savedUser.toObj()))
        .catch(e => next(e));
};
