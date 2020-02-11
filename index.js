const expressHttpContext = require('express-http-context');
const util = require('util');
// const mongoose = require('mongoose');
const logger = require('./config/logger');
const config = require('./config/config');
const app = require('./config/express');


logger.debug('logger debug level is on.');


// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

/*
// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// Todo - Add cache to mongoose

// connect to mongo db
const { mongoUri } = config;
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    poolSize: 2,
    // ssl: true, // Todo - set on in prod
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    autoReconnect: true,
    reconnectTries: 300000,
    reconnectInterval: 5000,
    promiseLibrary: global.Promise,
});
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
});
logger.info(`Mongoose is connected to ${mongoUri}`);


// print mongoose logs in dev env
if (config.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc, options) => {
        const opts = options ? ` opts[${JSON.stringify(options)}]` : '';
        logger.info(`mongoose - ${collectionName}.${method}${opts}`, JSON.stringify(util.inspect(query, false, 20)), JSON.stringify(doc));
    });
}
 */


// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    app.listen(config.port, () => {
        logger.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
}

module.exports = app;
