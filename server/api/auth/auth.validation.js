const Joi = require('joi');
const { reqValidationOptionsStrict } = require('../../../config/validation-consts');

const MIN_LENGTH = 3;
const MAX_LENGTH = 50;

module.exports = {
    login: {
        body: {
            nickName: Joi.string().max(MAX_LENGTH).required(),
            password: Joi.string().max(MAX_LENGTH).required(),
        },
        /*
        query: {
            shunra: Joi.string().max(MAX_LENGTH).required(),
        },
        */
        options: reqValidationOptionsStrict,
    },

    changePassword: {
        /*
        params: {
            userId: Joi.string().hex().required(),
        },
        */
        body: {
            nickName: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required(),
            oldPassword: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required(),
            newPassword: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required(),
        },
        options: reqValidationOptionsStrict,
    },
};
