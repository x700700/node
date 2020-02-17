const express = require('express');
const authRoutes = require('./api/auth/auth.route');
const solarRoutes = require('./api/solar/solar.route');


const router = express.Router(); // eslint-disable-line new-cap


router.get('/api/status', (req, res) =>
    res.send('OK')
);

router.use('/api/auth', authRoutes);

router.use('/api/solar', solarRoutes);


module.exports = router;
