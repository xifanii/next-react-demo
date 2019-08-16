const Koa = require('koa');
const Next = require('next');
const Router = require('koa-router');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = Next({ dev, dir: 'client' });


nextApp.prepare().then(() => {
  const app = new Koa();
  const router = new Router();

  // 全局变量&配置
  global.nextApp = nextApp;
  global.app = app;
  global.config = require('../config');
  
  const middleware = require('./middleware');
  app.use(middleware.logger());

  app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  // header请求
  router.head('/', async ctx => {
    ctx.body = {};
  });

  // router
  router.use(require('./routers/api').routes());
  router.use(require('./routers/view').routes());

  app.use(router.routes());

  app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
