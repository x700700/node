const express = require('express');
const solarCtrl = require('./solar.controller');


const router = express.Router(); // eslint-disable-line new-cap


const load = (req, res, next, stateCode) => {
    try {
        req.locals = { stateCode };
        return next();
    } catch (error) {
        return next(error, req, res);
    }
};


router.param('stateCode', load);


router.route('/state/:stateCode')
    .get(solarCtrl.state);

module.exports = router;
