const redis = require('redis');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

const blocklist = redis.createClient({ prefix: 'blocklist-access-token:' });
const genericListHandler = require('./genericListHandler');
const blocklistHandler = genericListHandler(blocklist);

function generateHashedToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

module.exports = {
  add: async (token) => {
    const expiresAt = jwt.decode(token).exp;
    const tokenHash = generateHashedToken(token);
    await blocklistHandler.add(tokenHash, '', expiresAt);
  },

  hasToken: async (token) => {
    const tokenHash = generateHashedToken(token);
    return await blocklistHandler.hasKey(tokenHash);
  },
};
