const axios = require('axios');
const http = require('http');
const https = require('https');
const uuid = require('uuid');
const { getIp, setClientCookie, toQueryString, diffTime } = require('./public');

const timeout = global.config.requestTimeout;
const instance = axios.create({
    timeout,
    responseType: 'json',
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    headers: { 'Content-Type': 'application/json' }
});

/*
    helpers
 */
function getReqLogStr(url, params, method = 'post') {
    // log确保删除本地多余参数
    delete params.defaultResponse;
    delete params.shouldLogin;
    delete params.noUserId;
    return `${url} - ${method}${method == 'get' ? '' : `:${JSON.stringify(params)}`}`;
}

function deleteLocalToken(ctx) {
    ctx.cookies.set('token', '', { path: '/', signed: false, maxAge: 0 });
    ctx.cookies.set('user_id', '', { path: '/', signed: false, maxAge: 0 });
}

// 给result包一层成功返回的body（异步）
function setCtxSuccessBody(ctx, result) {
    const body = {
        code: 0,
        msg: 'success',
        data: result
    };
    if (ctx.isAayncRequest) {
        ctx.body = body;
    }
    return body;
}

function setCtxBody(ctx, result) {
    if (ctx.isAayncRequest) {
        ctx.body = result;
    }
    return result;
}

/*
    普通请求
    params有两个特殊值：
    1、添加params.shouldLogin=true ---表示该接口是否必须登录才可调用成功，不添加则默认为否
    2、添加params.defaultResponse={///默认返回结构///} ---表示该接口容错，服务端请求失败则返回默认值
    3、添加params.noUserId=true ---表示该接口不需加user_id
 */
async function requestApi(ctx, url, params, method) {
    const start = new Date();
    const { defaultResponse } = params;
    let result = await commonRequest(ctx, url, params, method);
    
    // 返回结果处理
    const resultStr = JSON.stringify(result);
    if (result.code === 0) {
        ctx.logger.info(`${getReqLogStr(url, params, method)} ===> resp success diffTime:${diffTime(start)}`);
        ctx.logger.debug(`${url} ===> ${resultStr.slice(0, 500)}${resultStr.length > 500 ? '......' : ''}`);
    } else {
        ctx.logger.error(`${getReqLogStr(url, params, method)} ===> resp error result: ${resultStr} diffTime:${diffTime(start)}`);
        // token切换环境处理
        const tempToken = ctx.cookies.get('token');
        if (result.code === 11004 && tempToken && tempToken === ctx.cookies.get('token')) {
            deleteLocalToken(ctx);
        }
        // 容错请求
        if (defaultResponse) {
            result = {
                code: 0,
                msg: 'success',
                data: defaultResponse
            };
        }
    }
    return result;
}

async function commonRequest(ctx, url, params = {}, method = 'post') {
    // 添加基础参数user_id、req_id
    if (!params.user_id && !params.noUserId) {
        // 中间件会将user_id放入ctx.user_id中
        if (params.shouldLogin && !ctx.user_id) {
            // 必须登录时，验证token失败，返回报错
            return {
                code: 11004,
                msg: 'Token is not avaliable',
                data: {}
            };
        }
        params.user_id = ctx.user_id || 0;
    }
    params.req_id = `${ctx.requestId || uuid()}_${ctx.user_id}_${Date.now()}_${getIp(ctx)}`;
    
    // 删除本地多余参数
    delete params.defaultResponse;
    delete params.shouldLogin;
    delete params.noUserId;

    let result;
    try {
        const resp = await instance({
            method,
            url,
            data: params
        });
        if (resp.status !== 200) {
            result = {
                code: 10501,
                msg: 'java response status not 200',
                error: result
            };
        } else {
            result = resp.data;
        }
    } catch (error) {
        result = {
            code: 10500,
            msg: error.message || 'java response 500',
            error: error.stack
        };
    }
    return result;
}

// 普通接口请求，不会自动补req_id以及user_id参数
async function requestBaseApi({ url, data = {}, method = 'post', timeOut, headers }) {
    let result;
    try {
        const options = {
            method,
            url,
            data,
        };
        if (timeOut) options.timeout = timeOut;
        if (headers) options.header = headers;
        const resp = await instance(options);
        if (resp.status !== 200) {
            result = {
                code: 10501,
                msg: 'java response status not 200',
                error: result
            };
        } else {
            result = resp.data;
        }
    } catch (error) {
        result = {
            code: 10500,
            msg: error.message || 'java response 500',
            error: error.stack
        };
    }
    return result;
}

// 校验token
async function validToken(ctx, token) {
    const refresh_token = ctx.cookies.get('refresh_token');
    const url = `${global.config.api.restUserCenter}/user/validate/token`;
    const user_id = ctx.cookies.get('user_id');
    let result = {};

    if (token) {
        try {
            // 验证token
            const resp = await instance({
                url,
                method: 'post',
                data: {
                    token,
                    client_ip: getIp(ctx),
                    req_id: `${uuid()}_0_${Date.now()}_${getIp(ctx)}`
                }
            });
            if (resp.status !== 200) {
                result = {
                    code: 10501,
                    msg: 'java response status not 200',
                    error: result
                };
            } else {
                result = resp.data;
            }
            if (result.code === 0 && result.data.user_info) {
                ctx.user_id = result.data.user_info.uid || 0;
                ctx.logger.info(`${url} - token:${token} ===> resp success: `, ctx.user_id);
            } else if (result.code === 11004 && refresh_token && user_id) {
                await refreshToken(ctx);
            } else {
                ctx.user_id = 0;
                ctx.logger.error(`${url} - token:${token} ===> resp error code: `, result.code);
            }
        } catch (error) {
            ctx.user_id = 0;
            ctx.logger.error(`${url} - token:${token} ===> resp error: `, error.stack);
        }
    } else {
        ctx.user_id = 0; // 默认值
    }
    // 存cookie里（校验&&统计用）
    setClientCookie(ctx, 'user_id', ctx.user_id);

    return result;
}

// 刷新token
async function refreshToken(ctx) {
    const url = `${global.config.api.restUserCenter}/user/refresh_token`;
    const refresh_token = ctx.cookies.get('refresh_token');
    const user_id = ctx.cookies.get('user_id');
    let result = {};

    const resp = await instance({
        url,
        method: 'post',
        data: {
            refresh_token,
            user_id,
            client_ip: getIp(ctx),
            req_id: `${uuid()}_0_${Date.now()}_${getIp(ctx)}`
        }
    });
    if (resp.status !== 200) {
        result = {
            code: 10501,
            msg: 'java response status not 200',
            error: result
        };
    } else {
        result = resp.data;
    }
    if (result.code === 0 && result.data) {
        ctx.user_id = user_id;
        setClientCookie(ctx, 'token', result.data.token);
        setClientCookie(ctx, 'refresh_token', result.data.refresh_token);
        setClientCookie(ctx, 'notify_refresh_token', 1);
        ctx.logger.info(`${url} - refresh_token:${result.data.refresh_token} ===> resp success: `, ctx.user_id);
    } else {
        ctx.user_id = 0;
        ctx.logger.error(`${url} - refresh_token:${refresh_token} ===> resp error code: `, result.code);
    }

    return result;
}

// 封装请求
module.exports = {
    requestApi, // 普遍接口请求，会自动补req_id以及user_id参数
    requestBaseApi, // 普通接口请求，不会自动补req_id以及user_id参数
    commonRequest,
    validToken,
    getReqLogStr,
    setCtxSuccessBody,
    setCtxBody
};
