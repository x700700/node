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
    logger.info(`state=${stateCode}`);
    try {
        const [state, data] = await getStateData(stateCode);
        return res.json({
            ...state,
            data: data,
        });
    } catch (e) {
        next(e);
    }
};

exports.metric = async (req, res, next) => {
    const { stateCode, metric } = req.params;
    logger.info(`state=${stateCode} ; metric=${metric}`);
    try {
        const [state, data] = await getStateData(stateCode);
        if (!data || !data.outputs) throw new Error('data does not exist');
        const dataMetric = data.outputs[metric];
        if (!dataMetric) throw new Error('no data for metric - ', metric);
        return res.json({
            ...state,
            monthly: dataMetric.monthly,
        });
    } catch (e) {
        next(e);
    }
};

const min = (months) => {
    let _min = 100;
    Object.keys(months).forEach((key) => {
        if (months[key] < _min) {
            _min = months[key];
        }
    });
    return _min;
};
const max = (months) => {
    let _max = -100;
    Object.keys(months).forEach((key) => {
        if (months[key] > _max) {
            _max = months[key];
        }
    });
    return _max;
};

const analyticsTypes = {
    minAnnually: min,
    maxAnnually: max,
};

exports.analytics = async (req, res, next) => {
    const { stateCode, metric, analyticsType } = req.params;
    logger.info(`state=${stateCode} ; metric=${metric} ; analyticsType=${analyticsType}`);
    try {
        if (!analyticsTypes[analyticsType]) throw new Error('analytics type not found');

        const [state, data] = await getStateData(stateCode);
        if (!data || !data.outputs) throw new Error('data does not exist');
        const dataMetric = data.outputs[metric];
        if (!dataMetric) throw new Error('no data for metric - ', metric);

        const result = { ...state };

        result[analyticsType] = analyticsTypes[analyticsType](dataMetric.monthly);

        return res.json(result);
    } catch (e) {
        next(e);
    }
};
