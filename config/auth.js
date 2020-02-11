const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const APIError = require('./APIError');
const logger = require('./logger');
const consts = require('./consts');


exports.extractJwtPayload = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        // eslint-disable-next-line prefer-destructuring
        const token = req.headers.authorization.split(' ')[1];
        return jwt.verify(token, consts.jwtSecretKey);
    } else {
        return next(new APIError('JWT is invalid', httpStatus.NOT_FOUND));
    }
};


//
// For Cookie-Session. Not working with JWT
//
exports.requiresLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        const { user } = req;
        logger.info(`HTTP origin [${user.nickName}] req: ${req.originalUrl}`);
        return next();
    } else {
        logger.error(`Unauthenticated request origin [${req.ip}] - req: ${req.originalUrl}`);
        return next(new APIError('Please sign in.', httpStatus.UNAUTHORIZED));
    }
};
