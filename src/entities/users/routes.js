const Controller = require('./controller');
const authMiddlewares = require('./auth/middlewares');

module.exports = (app) => {
  app.post('/user', Controller.create);
  app.get('/user/verify_email/:token', Controller.verifyEmail);
  app.post('/user/login', authMiddlewares.local, Controller.login);
  app.post(
    '/user/logout',
    [authMiddlewares.refresh, authMiddlewares.bearer],
    Controller.logout
  );
  app.post('/user/refresh_token', authMiddlewares.refresh, Controller.login);
};
