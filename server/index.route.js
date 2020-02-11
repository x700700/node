const express = require('express');
const authRoutes = require('./api/auth/auth.route');


const router = express.Router(); // eslint-disable-line new-cap


router.get('/api/status', (req, res) =>
    res.send('OK')
);

router.use('/api/auth', authRoutes);


module.exports = router;
