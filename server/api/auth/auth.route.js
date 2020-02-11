const express = require('express');
const validate = require('express-validation');
// const jwt = require('jsonwebtoken'); // Todo - For Google Login sending back jwt
const passport = require('../../../config/passport');
const authValidation = require('./auth.validation');
const authCtrl = require('./auth.controller');


const router = express.Router(); // eslint-disable-line new-cap


router.route('/login')
    .post(validate(authValidation.login), authCtrl.login);

router.route('/check')
    .get(passport.authenticate('jwt', { session: false }), authCtrl.check);

router.route('/logout')
    .post(passport.authenticate('jwt', { session: false }), authCtrl.logout);


router.route('/google')
    .post(passport.authenticate('google-token', {
            session: false,
        }),
        (req, res) => {
            res.send(req.user);
        });

    // Todo - GoogleStrategy (passport-google-oauth) is not working. Token is not received.
    /*
    .get(passport.authenticate('google', {
        session: false,
        scope: ['email', 'profile']
    }));
    */

/*
// Todo - GoogleStrategy (passport-google-oauth) is not working. Token is not received.
router.route('/google/callback')
    .get(passport.authenticate('google', { session: false }), (req, res) => {
        logger.info('Google Callback =====>', req);
        // const token = jwt.sign(req.user.nickName, consts.jwtSecretKey);
        res.send({ user: null, token: 'aaa' });
    }
);
*/


/*
router.route('/logout-google')
    .get(auth.requiresLogin, authCtrl.logoutGoogle);
*/

router.route('/change-password')
    .post(passport.authenticate('jwt', { session: false }), validate(authValidation.changePassword), authCtrl.changePassword);

// Todo - Forgot Password - in: mail, name -> change password to random, login, and send cookie + new password

module.exports = router;
