/*
// Todo - Enable once Redis in use..!

const Redis = require('ioredis');
const logger = require('./logger');
const config = require('../config/config');

const redis = new Redis({
    host: (config.redis || {}).host || 'localhost',
    port: (config.redis || {}).port || '6379',

    retryStrategy: (times) => {
        logger.info(`Redis down. retry #${times}`);
        return Math.min(times * 1000, 3000);
    },
    maxRetriesPerRequest: 1,
});

module.exports = redis;
 */
