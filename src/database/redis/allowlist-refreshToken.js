const redis = require('redis');
const genericListHandler = require('./genericListHandler');

const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token:' });

module.exports = genericListHandler(allowlist);
