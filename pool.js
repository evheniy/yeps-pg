const debug = require('debug')('yeps:pg');
const { Pool } = require('pg');

const config = require('config');

debug(config.pg);

module.exports = new Pool(config.pg);
