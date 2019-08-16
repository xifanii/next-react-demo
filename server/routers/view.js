// @VIEW
const handle = nextApp.getRequestHandler();
const router = require('koa-router')();
const middleware = require('../middleware');

//page router 将ctx挂到ctx.req传递, 以便page拿出来用
const renderPage  = (path) => {
    return async (ctx, next) => {
        ctx.req.ctx = ctx;
        await nextApp.render(ctx.req, ctx.res, path);
    }
};

//具体路由（需要添加特殊中间件||重定向路由）
// router.get('/gate', renderPage('/gate'));

//默认路由
router.get('*', async ctx => {
    ctx.req.ctx = ctx;
    await handle(ctx.req, ctx.res);
});

module.exports = router;
