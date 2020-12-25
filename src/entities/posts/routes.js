const Controller = require('./controller');
const { authMiddlewares } = require('../users/composer');

module.exports = (app) => {
  app.get('/api/posts', Controller.index);
  app.get('/api/post/:slug', Controller.read);
  app.post('/api/post', authMiddlewares.bearer, Controller.create);
  app.delete('/api/post/:id', authMiddlewares.bearer, Controller.delete);
};
