const Controller = require('./controller');
const authMiddlewares = require('./auth/middlewares');

module.exports = (app) => {
  app.post('api/user', Controller.create);
  app.get('api/user/verify_email/:token', Controller.verifyEmail);
  app.post('api/user/login', authMiddlewares.local, Controller.login);
  app.post(
    'api/user/logout',
    [authMiddlewares.refresh, authMiddlewares.bearer],
    Controller.logout
  );
  app.post('api/user/refresh_token', authMiddlewares.refresh, Controller.login);
};
