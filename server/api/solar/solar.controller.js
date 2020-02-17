const logger = require('../../../config/logger');
const states = require('../../common/states');


const getState = stateCode => states[stateCode.toUpperCase()];


exports.state = (req, res, next) => {
    const { stateCode } = req.locals;
    logger.info(`state - ${stateCode}`);
    const state = getState(stateCode);
    return res.json(state);
};
