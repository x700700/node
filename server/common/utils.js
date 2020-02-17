const axios = require('axios');
const logger = require('../../config/logger');


exports.fetch = async (url) => {
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
