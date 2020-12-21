const config = require('./config');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./database/redis/blocklist-accessToken');
require('./database/redis/allowlist-refreshToken');
const app = require('./express');
const routes = require('./routes');

app.use(cors());

routes(app);
console.log(`Currently running on ${config.NODE_ENV} environment.`);
app.listen(config.PORT, config.HOST, () => {
  console.log(`API listening on http://${config.HOST}:${config.PORT}`);
});
