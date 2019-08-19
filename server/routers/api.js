// @API
/*
    --------------------------------------------------------------------
    异步api请求原则：
    1、拉取数据用get，对数据有更改的用post
    2、请求参数里有数组、对象类型的用post（get请求只接收简单的string、number类型）
    3、路径组成：/{api模块}/{方法名}
    --------------------------------------------------------------------
 */
const router = require('koa-router')();
const controllers = require('../controllers');

router.prefix('/api');

/*
    获取params,挂载到ctx.apiParams
*/
const api = (apiModule, func) => {
    return async ctx => {
        if (ctx.request.method == 'GET') {
            // get
            ctx.apiParams = ctx.query || {};
        } else {
            // post
            ctx.apiParams = ctx.request.body || {};
        }
        ctx.isAayncRequest = true; // 标注浏览器异步请求，不做ctx.body赋值操作
        await controllers[apiModule][func](ctx, ctx.apiParams);
    };
};

// news
router.get('/news/getArticleList', api('news', 'getArticleList'));

// locals
router.get('/locals/getGlobalConfig', api('locals', 'getGlobalConfig'));
router.get('/locals/getLocalConfig', api('locals', 'getLocalConfig'));

module.exports = router;
