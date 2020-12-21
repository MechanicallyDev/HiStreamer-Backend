const Users = require('./entities/users/composer');
const Posts = require('./entities/posts/composer');

module.exports = (app) => {
  Users.routes(app);
  Posts.routes(app);
};
