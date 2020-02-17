const axios = require('axios');
const logger = require('../../../config/logger');
const states = require('../../common/states');


const getSolarApi = (lat, lon) => `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=DEMO_KEY&lat=${lat}&lon=${lon}`;
const getState = stateCode => states[stateCode.toUpperCase()];

const fetch = async (url) => {
    logger.info('<<<', url);
    try {
        const response = await axios.get(url);
        logger.info('>>>', response.data);
        return response.data;
    } catch (error) {
        logger.info('fetch ERROR: ', error);
        throw new Error(error);
    }
};


exports.state = async (req, res, next) => {
    const { stateCode } = req.locals;
    logger.info(`state - ${stateCode}`);
    const state = getState(stateCode);
    if (!state) throw new Error('State code does not exist');
    const solarApi = getSolarApi(state.latitude, state.longitude);

    const data = await fetch(solarApi);

    return res.json({
        ...state,
        api: solarApi,
        data: data,
    });
};
