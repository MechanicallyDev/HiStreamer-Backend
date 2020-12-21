const Controller = require('./controller');
const { authMiddlewares } = require('../users/composer');

module.exports = (app) => {
  app.get('/posts', Controller.index);
  app.post('/post', authMiddlewares.bearer, Controller.create);
  app.delete('/post/:id', authMiddlewares.bearer, Controller.delete);
};
