const md5 = require('blueimp-md5');
const cookieMaxAge = 30 * 24 * 60 * 60 * 1000; //30天

function isWeixinBrowser(ctx) {
    const ua = ctx.headers['user-agent'].toLowerCase();
    return (/micromessenger/.test(ua));
}

function isQQBrowser(ctx) {
    const ua = ctx.header['user-agent'].toLowerCase();
    return (/qq/.test(ua));
}

//判断是否在wps应用中
function isWpsBrowser(ctx) {
    const ua = ctx.header['user-agent'].toLowerCase();
    return ((/wpsmoffice/i).test(ua));
}

function getHostDomainLevel(ctx, level) {
    const host = ctx.request.host;

    //本地加端口调试时
    if (host.indexOf(":") > -1) {
        const hostArray = host.split(":");
        return hostArray[0];
    }

    const hostArray = host.split(".");
    const hostArrayLen = hostArray.length;
    if (
        (!level) ||
        (level >= hostArrayLen)
    ) {
        return host;
    }
    return hostArray.splice(0, hostArrayLen - level) && hostArray.join(".");
}

function setTokenCode(ctx, cookieObj = {}) {
    if ((cookieObj.province_id && cookieObj.wenli) || cookieObj.province_id && cookieObj.select_course) {
        const token = ctx.query.token || ctx.get('token') || ctx.cookies.get('token');
        const {
            province_id,
            wenli,
            score,
            score_rank,
            score_type,
            diploma_id,
            batch,
            score_diploma_id,
            score_batch
        } = cookieObj;
        const token_code_obj = {
            province_id,
            wenli,
            score,
            score_rank,
            score_type,
            diploma_id,
            batch,
            score_diploma_id,
            score_batch
        };
        let data_str = JSON.stringify(token_code_obj) + "_" + token;
        let md5_str = md5(data_str);
        cookieObj.token_code = md5_str;
    }
}

function setClientCookie(ctx, key, value, maxAge) {
    let cookieObj = {};
    if (typeof key === 'string') {
        cookieObj[key] = value;
    } else {
        cookieObj = key;
        setTokenCode(ctx, cookieObj);
    }

    Object.keys(cookieObj).map((item) => {
        if (cookieObj[item]) {
            ctx.cookies.set(
                item,
                cookieObj[item], {
                    // domain: getHostDomainLevel(ctx, 3), // 写cookie所在的域名，不设置默认域名！！
                    path: '/', // 写cookie所在的路径
                    maxAge: maxAge || cookieMaxAge, // cookie有效时长
                    httpOnly: false, // 是否只用于http请求中获取
                    overwrite: true // 是否允许重写
                }
            );
        }
        return null;
    });
}

function diffTime(start) {
    const delta = new Date - start;
    return delta < 10000
        ? delta + 'ms'
        : Math.round(delta / 1000) + 's';
}

function throwError(res) {
    const error = new Error();

    error.code = res.code;
    error.message = res.message;
    throw error;
}

//通过req的hearers来获取客户端ip
function getIp(ctx) {
    const req = ctx.request;
    var ip = req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        ctx.ip;
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
}

function dataToQuerystr(json) {
    if (!json) return ''
    delete json["_isQuerystr"];
    var str = "";
    Object.keys(json).map(key => {
        if (json[key] == undefined) json[key] = '';
        str += key + "=" + json[key] + "&";
    });
    return str;
}

// 转化get参数
function toQueryString(obj = {}) {
    var parts = [];
    for (let key in obj) {

        if (obj.hasOwnProperty(key)) {
            let value = obj[key];
            if (value != null && value !== '') {
                parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            }
        }
    }
    return parts.join('&').replace(/%20/g, '+');
}

module.exports = {
    isWeixinBrowser,
    isQQBrowser,
    isWpsBrowser,
    dataToQuerystr,
    toQueryString,
    getHostDomainLevel,
    setClientCookie,
    throwError,
    getIp,
    diffTime
};