const bcrypt = require('bcrypt');
const validations = require('../../helpers/commonValidations');
const { InvalidArgumentError } = require('../../helpers/errors');
const userDAO = require('../../database/mongoDB/userSchema');

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.picture = user.picture;
    this.email = user.email;
    this.password = user.password;
    this.rule = user.rule;
    this.verified = user.verified;
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
    const created_at = new Date();
    const updated_at = new Date();
    const createdUser = await userDAO.create({
      id: '0',
      name,
      email,
      password,
      rule,
      picture,
      verified: false,
      created_at,
      updated_at,
    });
    const { _id } = createdUser;
    await userDAO.findByIdAndUpdate(_id, { id: _id });
    this.id = _id;
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
    const user = await userDAO.findById(id);
    if (!user) {
      return null;
    }
    return new User(user);
  }

  static async searchEmail(email) {
    const user = await userDAO.findOne({ email });
    if (!user) {
      return null;
    }
    return new User(user);
  }

  static async verifyUser(id) {
    this.verified = true;
    await userDAO.findByIdAndUpdate(id, { verified: true });
  }
}

module.exports = User;
