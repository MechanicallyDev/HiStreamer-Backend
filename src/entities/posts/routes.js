const Controller = require('./controller');
const { authMiddlewares } = require('../users/composer');
const cors = require('cors');

module.exports = (app) => {
  app.get('/posts', Controller.index);
  app.get('/post/:slug', Controller.read);
  app.post('/post', authMiddlewares.bearer, Controller.create);
  app.delete('/post/:id', authMiddlewares.bearer, Controller.delete);
};
