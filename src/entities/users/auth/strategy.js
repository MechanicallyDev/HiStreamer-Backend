const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { InvalidArgumentError } = require('../../../helpers/errors');
const bcrypt = require('bcrypt');

const User = require('../model');
const tokens = require('./tokens');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.searchEmail(email);
        checkUser(user);
        await checkPassword(password, user.password);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const id = await tokens.access.verify(token);
      const user = await User.searchID(id);
      done(null, user, { token });
    } catch (error) {
      done(error);
    }
  })
);

async function checkUser(user) {
  if (!user) throw new InvalidArgumentError('User not found');
}
async function checkPassword(password, hashPassword) {
  const isValid = await bcrypt.compare(password, hashPassword);
  if (!isValid) throw new InvalidArgumentError('Invalid email or password');
}
