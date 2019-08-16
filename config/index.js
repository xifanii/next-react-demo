const { NODE_ENV } = process.env;
const fileName = NODE_ENV === 'production' ? 'production' : 'development';
const config = require(`./${fileName}.json`);

const localConfig = require('./local.json');
const globalConfig = require('./global.json');
config.local = localConfig;
config.global = globalConfig;

module.exports = config;
