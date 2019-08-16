const { setCtxSuccessBody } = require('../utils/request');

module.exports = {

    /**
     * 
     * @api {get} /ui-api/locals/getGlobalConfig 拉取全局配置
     * @apiName getGlobalConfig
     * @apiGroup Locals
     * @apiVersion  0.1.0
     * 
     * @apiExample {curl} 请求例子
     * curl --header 'Content-type:application/json' --header 'token:3CeFHNnEN15Vqs5z2thmXJop-nV4Wyz2HAtKxtAb3A27p2VL1OHy_3VHceIb5-ae2rbFC7C6_l1aPFC5vFEdHW==' 'http://mobile.wmzy.com/ui-api/news/getArticleList?article_type=2'
     * 
     * @apiHeader {String} [token] 用户token
     * 
     */
    async getGlobalConfig(ctx, apiParams) {
        const result = global.config.global;
        return setCtxSuccessBody(ctx, result);
    },

    /**
     * 
     * @api {get} /ui-api/locals/getLocalConfig 拉取局部配置
     * @apiName getLocalConfig
     * @apiGroup Locals
     * @apiVersion  0.1.0
     * 
     * @apiExample {curl} 请求例子
     * curl --header 'Content-type:application/json' --header 'token:3CeFHNnEN15Vqs5z2thmXJop-nV4Wyz2HAtKxtAb3A27p2VL1OHy_3VHceIb5-ae2rbFC7C6_l1aPFC5vFEdHW==' 'http://mobile.wmzy.com/ui-api/news/getArticleList?article_type=2'
     * 
     * @apiHeader {String} [token] 用户token
     * 
     */
    async getLocalConfig(ctx, apiParams) {
        const { name } = apiParams;
        console.log("ctx.cookies >>>", ctx.cookies);
        const result = global.config.local[name];
        return setCtxSuccessBody(ctx, result);
    },
    
};
