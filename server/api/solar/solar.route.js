const express = require('express');
const solarCtrl = require('./solar.controller');


const router = express.Router(); // eslint-disable-line new-cap

/*
const load = (req, res, next, stateCode, metric) => {
    try {
        req.locals = { stateCode, metric };
        return next();
    } catch (error) {
        return next(error, req, res);
    }
};
router.param('stateCode', load);
 */

router.route('/state/:stateCode')
    .get(solarCtrl.state);

router.route('/state/:stateCode/:metric')
    .get(solarCtrl.metric);

module.exports = router;
