module.exports = {
  routes: require('./routes'),
  controller: require('./controller'),
  model: require('./model'),
  authStrategy: require('./auth/strategy'),
  authMiddlewares: require('./auth/middlewares'),
};
