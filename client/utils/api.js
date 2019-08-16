import axios from 'axios';
import md5 from 'blueimp-md5';

const REQCACHE = {};

const defaultOptions = {
    mode: 'cors',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        cookie: process.browser ? document.cookie : ''
    },
};

const instance = axios.create({
    baseURL: '/ui-api',
    headers: defaultOptions.headers,
});

async function requireInServer(url, data = {}) {
    const apiParentModule = await import('@server/controllers');
    const array = url.split('/');

    if (array.length === 3) {
        const { ctx } = data;
        delete data.ctx;
        const apiModule = array[1];
        const func = array[2];
        return await apiParentModule[apiModule][func](ctx, data);
    }
    return {
        code: 10201,
        msg: 'node response status not 200',
        error: {}
    };
}

async function get(url, data = {}, options = {}) {
    if (!process.browser) {
        // 服务端
        return await requireInServer(url, data);
    }
    const method = { method: 'GET' };
    const queryString = toQueryString(data);
    url += queryString;
    return await connect(url, Object.assign(method, options));
}

async function post(url, data = {}, options = {}) {
    if (!process.browser) {
        // 服务端
        return await requireInServer(url, data);
    }
    const method = { method: 'POST' };
    options.body = JSON.stringify(data);
    return await connect(url, Object.assign(method, options));
}

async function put(url, data = {}, options = {}) {
    if (!process.browser) {
        // 服务端
        return await requireInServer(url, data);
    }
    const method = { method: 'PUT' };
    options.body = JSON.stringify(data);

    return await connect(url, Object.assign(method, options));
}

async function connect(url, options) {
    // 判断是否使用缓存
    let opt_str;
    let md5_str;
    if (options.use_cache) {
        opt_str = JSON.stringify(options);
        md5_str = md5(url + opt_str);
        if (REQCACHE[md5_str]) return REQCACHE[md5_str];
    }

    let result;
    try {
        const resp = await instance(url, options);
        if (resp.status !== 200) {
            result = {
                code: 10201,
                msg: 'node response status not 200',
                error: result
            };
        } else {
            result = resp.data;
        }
    } catch (error) {
        result = {
            code: 10500,
            msg: error.message || '[server.js] fetch error',
            error: error.stack
        };
    }
    return result;
}

// helper ----------------------------------------------------------------------

// 将json转为查询字符串
// 如：{a:1, b:2} => ?a=1&b=2
function toQueryString(obj = {}) {
    const parts = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value != null && value !== '') {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
    }

    return `?${parts.join('&').replace(/%20/g, '+')}`;
}

export default {
    get,
    post,
    put
};
