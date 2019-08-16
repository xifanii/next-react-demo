const { requestApi, setCtxBody } = require('../utils/request');

const restModule = global.config.api.restNews;

module.exports = {

    /**
     * 
     * @api {get} /ui-api/news/getArticleList 拉取文章列表
     * @apiName getArticleList
     * @apiGroup News
     * @apiVersion  0.1.0
     * 
     * @apiExample {curl} 请求例子
     * curl --header 'Content-type:application/json' --header 'token:3CeFHNnEN15Vqs5z2thmXJop-nV4Wyz2HAtKxtAb3A27p2VL1OHy_3VHceIb5-ae2rbFC7C6_l1aPFC5vFEdHW==' 'http://mobile.wmzy.com/ui-api/news/getArticleList?article_type=2'
     * 
     * @apiExample {curl} 后台java请求例子
     * curl --header 'Content-type:application/json' http://192.168.150.18:33200/article/getList' -d '{"province_id":"430000000000","article_type":"2","page":1,"page_len":10,"req_id":"ui-common-bfa8-ec1dc58312ab_0_1562749124000_::1"}'
     * 
     * @apiHeader {String} [token] 用户token
     * 
     * @apiParam {String} article_type 文章类别（0-头条，1-政策，2-出国，3-升学）
     * @apiParam {String} [province_id] 用户省份
     * @apiParam {String} [page] 页码，默认1
     * @apiParam {String} [page] 页码，默认1
     * 
     */
    async getArticleList(ctx, apiParams) {
        const url = `${restModule}/article/getList`;
        const params = {
            province_id: apiParams.province_id || ctx.query.province_id || ctx.cookies.get('province_id') || 0,
            article_type: apiParams.article_type || 0,
            page: apiParams.page || 1,
            page_len: apiParams.page_len || 10,
        };
        const result = await requestApi(ctx, url, params);
        return setCtxBody(ctx, result);
    },
    
};
