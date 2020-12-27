const User = require('./model');
const tokens = require('./auth/tokens');
const { VerificationEmail } = require('./auth/emails');

function generateLink(route, token) {
  const host = process.env.HOST;
  const port = process.env.PORT;
  return `http://${host}:${port}/${route}/${token}`;
}

module.exports = {
  async create(req, res) {
    const { name, email, password, picture } = req.body;
    try {
      const user = new User({
        name,
        email,
        picture,
      });

      await user.addHashedPassword(password);
      await user.create();
      const emailtoken = tokens.emailVerification.create(user.id);
      const link = generateLink('api/user/verify_email', emailtoken);
      const verificationEmail = new VerificationEmail(user, link);
      verificationEmail.sendMail().catch(console.log);
      res.status(201).json();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const accessToken = tokens.access.create(req.user.id);
      const refreshToken = await tokens.refresh.create(req.user.id);
      res.set('Authorization', accessToken);
      res.status(200).json({ refreshToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async verifyEmail(req, res) {
    try {
      const id = await tokens.emailVerification.verify(req.params.token);
      const user = await User.searchID(id);
      if (user.verified)
        return res
          .status(400)
          .json({ error: 'This user was already verified' });
      await User.verifyUser(id);
      return res
        .status(200)
        .json({ message: 'User verified, you can now login' });
    } catch (error) {
      console.log(error);
      if (error.name === 'JsonWebTokenError')
        return res.status(400).json({ error: error.message });
      if (error.name === 'TokenExpiredError')
        return res
          .status(401)
          .json({ error: error.message, expiredAt: error.expiredAt });
      return res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await tokens.access.invalidate(token);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
