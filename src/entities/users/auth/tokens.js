const crypto = require('crypto');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { InvalidArgumentError } = require('../../../helpers/errors');
const allowlistRefreshToken = require('../../../database/redis/allowlist-refreshToken');
const blocklistAccessToken = require('../../../database/redis/blocklist-accessToken');

async function createOpaqueToken(id, [timeAmount, timeUnit], allowlist) {
  const token = crypto.randomBytes(24).toString('hex');
  const expirationDate = moment().add(timeAmount, timeUnit).unix();
  await allowlist.add(token, id, expirationDate);
  return token;
}
async function checkOpaqueToken(token, name, allowlist) {
  CheckTokenEmpty(token, name);
  const id = await allowlist.returnValue(token);
  CheckTokenValid(id, name);
  return id;
}
function CheckTokenValid(id, name) {
  if (!id) throw new InvalidArgumentError(`Invalid ${name}`);
}
function CheckTokenEmpty(token, name) {
  if (!token) throw new InvalidArgumentError(`Empty ${name}`);
}
async function invalidateOpaqueToken(token, allowlist) {
  await allowlist.delete(token);
}

function createJWTToken(id, [timeAmount, timeUnit]) {
  const payload = { id };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: timeAmount + timeUnit,
  });
  return token;
}
async function checkJWTToken(token, name, blocklist) {
  await checkBlocklist(token, name, blocklist);
  const { id } = jwt.verify(token, process.env.JWT_KEY);
  return id;
}
async function checkBlocklist(token, name, blocklist) {
  if (!blocklist) return;
  const isBlocklisted = await blocklist.hasToken(token);
  if (isBlocklisted) {
    throw new jwt.JsonWebTokenError(`${name} has already logged out`);
  }
}
function invalidateJWTToken(token, blocklist) {
  return blocklist.add(token);
}

module.exports = {
  access: {
    name: 'Access Token',
    list: blocklistAccessToken,
    expiration: [15, 'm'],
    create(id) {
      return createJWTToken(id, this.expiration);
    },
    verify(token) {
      return checkJWTToken(token, this.name, this.list);
    },
    invalidate(token) {
      return invalidateJWTToken(token, this.list);
    },
  },
  refresh: {
    list: allowlistRefreshToken,
    name: 'Refresh Token',
    expiration: [5, 'd'],
    async create(id) {
      return await createOpaqueToken(id, this.expiration, this.list);
    },
    verify(token) {
      return checkOpaqueToken(token, this.name, this.list);
    },
    invalidate(token) {
      return invalidateOpaqueToken(token, this.list);
    },
  },
  emailVerification: {
    name: 'Email Verification Token',
    expiration: [1, 'h'],
    create(id) {
      return createJWTToken(id, this.expiration);
    },
    verify(token) {
      return checkJWTToken(token, this.name);
    },
  },
};
