const logger = require('../../../config/logger');
const { fetch } = require('../../common/utils');
const states = require('../../common/states');


const getSolarApi = (lat, lon) => `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=DEMO_KEY&lat=${lat}&lon=${lon}`;
const getState = stateCode => states[stateCode.toUpperCase()];

const getStateData = async (stateCode) => {
    const state = getState(stateCode);
    if (!state) throw new Error('State code does not exist');
    const solarApi = getSolarApi(state.latitude, state.longitude);
    const data = await fetch(solarApi);
    return [state, data];

};

exports.state = async (req, res, next) => {
    const { stateCode } = req.params;
    logger.info(`state - ${stateCode}`);
    const [state, data] = await getStateData(stateCode);
    return res.json({
        ...state,
        data: data,
    });
};

exports.metric = async (req, res, next) => {
    const { stateCode, metric } = req.params;
    const [state, data] = await getStateData(stateCode);
    if (!data || !data.outputs) throw new Error('data does not exist');
    const dataMetric = data.outputs[metric];
    if (!dataMetric) throw new Error('no data for metric - ', metric);
    return res.json({
        ...state,
        dataMetric: dataMetric,
    });
};
