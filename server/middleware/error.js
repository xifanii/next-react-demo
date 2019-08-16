module.exports = () => {
    
    return async (ctx, next) => {
        await next()
        .then(() => {})
            .catch(async (error = {}) => {

            const { url } = ctx.req;
            let errorDesc = '';
            if (error.code && error.msg) {
                errorDesc = JSON.stringify(error);
            } else {
                errorDesc = error.stack || error.detail || 'error';
            }
            ctx.logger.error('[[[catch error]]] >>> ', errorDesc);

            if (url.indexOf('/ui-api/') === -1) {
                if (errorDesc.indexOf("11004") >= 0) {
                    await ctx.render('_common/exception-login.ejs', {
                        title: '登录异常',
                        errorDesc: errorDesc
                    });
                } else {
                    await ctx.render('_common/exception.ejs', {
                        title: '异常报错',
                        errorDesc: errorDesc
                    });
                }                
            } else if (!ctx.body || !ctx.body.code) {
                ctx.status = 500;

                error = {
                    code: 10500,
                    msg: error.message || 'java response 500',
                    error: error.detail || {}
                };
                ctx.body = error;
            } else {
                //has ctx.body
            }

        });
    }
};
