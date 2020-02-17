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

// Analytics Functions:
const min = (months) => {
    return Math.min(...Object.values(months));
};
const max = (months) => {
    return Math.max(...Object.values(months));
};

// Analytics Types Map - Name <> Function:
const analyticsTypes = {
    minAnnually: min,
    maxAnnually: max,
};


// phase #3 - Full exercise:
// 127.0.0.1:4044/api/solar/state/al/avg_dni/maxAnnually?months=jan,feb,jun
exports.analytics = async (req, res, next) => {
    const { stateCode, metric, analyticsType } = req.params;
    const args = req.query;
    logger.info(`state=${stateCode} ; metric=${metric} ; analyticsType=${analyticsType}`);
    logger.info('analytics args = ', args.months);

    try {
        if (!analyticsTypes[analyticsType]) throw new Error('analytics type not found');

        const [state, data] = await getStateData(stateCode);
        if (!data || !data.outputs) throw new Error('data does not exist');
        const dataMetric = data.outputs[metric];
        if (!dataMetric) throw new Error('no data for metric - ', metric);

        // filter months by args:
        let monthly = {};
        if (args.months) {
            const months = args.months.toLowerCase().split(',');
            months.forEach((key) => {
                monthly[key] = dataMetric.monthly[key];
            });
        } else {
            monthly = dataMetric.monthly;
        }

        const result = { ...state, monthly: monthly };
        result[analyticsType] = analyticsTypes[analyticsType](monthly);

        return res.json(result);
    } catch (e) {
        next(e);
    }
};




// ============================================================================================================================
// ============================================================================================================================
// phase #1 - partial
// 127.0.0.1:4044/api/solar/state/al
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

// phase #2 - partial
// 127.0.0.1:4044/api/solar/state/al/avg_dni
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
