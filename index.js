const debug = require('debug')('yeps:pg');
const pool = require('./pool');

module.exports = () => async (context) => {
  debug('PostgreSQL client created');

  context.pg = pool;
};
