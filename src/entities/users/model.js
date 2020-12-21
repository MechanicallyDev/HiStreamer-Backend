const bcrypt = require('bcrypt');
const validations = require('../../helpers/commonValidations');
const { InvalidArgumentError } = require('../../helpers/errors');
const connection = require('../../database/connection');

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.picture = user.picture;
    this.email = user.email;
    this.password = user.password;
    this.rule = user.rule;
    this.isVerified = user.isVerified;
    this.validate();
  }
  validate() {
    validations.StringNotNull(this.name, 'name');
    validations.StringNotNull(this.picture, 'picture');
    validations.StringNotNull(this.email, 'email');
  }
  async create() {
    if (await User.searchEmail(this.email)) {
      throw new InvalidArgumentError(
        'There is already an user with this e-mail.'
      );
    }
    const { name, email, password, picture } = this;
    const rule = 'user';
    await connection('users').insert({
      name,
      email,
      password,
      rule,
      picture,
    });
    const { id } = await User.searchEmail(this.email);
    this.id = id;
  }
  async addHashedPassword(password) {
    validations.StringNotNull(password, 'password');
    validations.StringMinSize(password, 'password', 8);
    validations.StringMaxSize(password, 'password', 64);
    this.password = await User.generateHashPassword(password);
  }
  static generateHashPassword(password) {
    const hashCost = 12;
    return bcrypt.hash(password, hashCost);
  }
  static async searchID(id) {
    const user = await connection('users').where('id', id).select('*').first();
    if (!user) {
      return null;
    }
    return new User(user);
  }

  static async searchEmail(email) {
    const user = await connection('users')
      .where('email', email)
      .select('*')
      .first();
    if (!user) {
      return null;
    }
    return new User(user);
  }

  static async verifyUser(id) {
    this.isVerified = 1;
    await connection('users').where({ id }).update({ isVerified: 1 });
  }
}

module.exports = User;
