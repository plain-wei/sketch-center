const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/db');
const Skom = require('./lib/skoa');
const query = require('./database');

const sessionMysqlConfig = {
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
  host     : config.database.HOST,
};

const app = new Skom();

app.use(session({
  key   : 'USER_SID',
  store : new MysqlStore(sessionMysqlConfig),
}));

app.use(async(ctx, next) => {
  ctx.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  ctx.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  ctx.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
  ctx.setHeader('Access-Control-Allow-Credentials', true);
  ctx.setHeader('Access-Control-Max-Age', 3600 * 24);
  await next();
});

app.on('error', (err) => {
  console.warn(err);
});

app.use(async(ctx, next) => {
  const SQL = 'SELECT * FROM USER_INFO';
  const result = await query(SQL);

  console.warn(result);
  ctx.body = result;
});
app.listen(3000);
