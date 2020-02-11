// const path = require('path');
const Joi = require('joi');


require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    PORT: Joi.number()
        .default(4069),
    /*
    REDIS_HOST: Joi.string().required()
        .description('Redis host url')
        .required(),
    REDIS_PORT: Joi.number()
        .description('Redis connection port')
        .default(6379),
     */

}).unknown();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    /*
    redis: {
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
    },
     */
};

module.exports = config;
