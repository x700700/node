const express = require('express');
const solarCtrl = require('./solar.controller');


const router = express.Router(); // eslint-disable-line new-cap


// 127.0.0.1:4044/api/solar/state/al

router.route('/state/:stateCode')
    .get(solarCtrl.state);


// 127.0.0.1:4044/api/solar/state/al/avg_dni

router.route('/state/:stateCode/:metric')
    .get(solarCtrl.metric);


// 127.0.0.1:4044/api/solar/state/al/avg_dni/maxAnnually?months=jan,feb,jun

router.route('/state/:stateCode/:metric/:analyticsType')
    .get(solarCtrl.analytics);

module.exports = router;
