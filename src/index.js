require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const history = require('connect-history-api-fallback');
const generatePassword = require('password-generator');

const app = require('../app'); // eslint-disable-line
const server = app.server = express(); // eslint-disable-line

const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
// const MongoStore = require('connect-mongo')(session);

const root = path.normalize(`${__dirname}/..`);

let cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  try {
    cookieSecret = fs.readFileSync(`${root}/storage/.cookie`, 'utf-8');
  } catch (err) {
    cookieSecret = generatePassword(128, false);
    fs.writeFileSync(`${root}/storage/.cookie`, cookieSecret);
  }
}

// setup for express
if (process.env.NODE_ENV === 'production') server.use(helmet({ hsts: false, contentSecurityPolicy: false }));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  next();
});
server.use(compression());
server.set('trust proxy', 1); // trust first proxy
server.set('json spaces', 4);
app.express_session = session({
  cookie: {
    path: '/',
    domain: process.env.PROXY_DOMAIN || 'local.codie.cloud',
    httpOnly: false,
    maxAge: null,
  },
  resave: false,
  saveUninitialized: true,
  store: new SQLiteStore({ dir: `${root}/storage/` }),
  name: process.env.COOKIE_NAME || 'cloud.codie.local.sid',
  // store: new MongoStore({
  //   mongooseConnection: app.mongoose.connection,
  //   ttl: 5 * 60 * 60, // = 5 hours
  //   touchAfter: 5 * 60, // 5 min
  // }),
  secret: cookieSecret,
});
server.use(app.express_session);

server.use(bodyParser.json({ limit: '5mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
server.use(bodyParser());

server.use('/api/', require('./routes/api'));
server.use(history());

// hotload the vue files
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const Webpack = require('webpack');
  // eslint-disable-next-line global-require
  const webpackConfig = require('../webpack.config');

  const compiler = Webpack(webpackConfig);
  // eslint-disable-next-line global-require
  server.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: `${root}/src/client`,
    hot: true,
    inline: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: 'minimal', /* {
      chunks: false,
      chunkModules: false,
      colors: true,
      modulesSort: '!size',
    }, */
  }));

  // eslint-disable-next-line global-require
  server.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
  }));
}

server.use(express.static(`${root}/dist`));
server.use(express.static(`${root}/src/client/public`));

server.get('*', (req, res) => res.sendFile(`${root}/dist/index.html`));

const port = process.env.PORT || 9002;

app.httpServer = server.listen(port, (err) => {
  if (err) console.error(err); // eslint-disable-line no-console
  console.log(`Server listening on: http://localhost:${port}`); // eslint-disable-line no-console
});
