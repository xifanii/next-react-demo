const bytes = require('bytes');
const log4js = require('log4js');
const uuid = require('uuid');
const util = require('util');

//确定log目录
const path = require("path");
const fs = require("fs");
const logConfig = global.config.log;

const { NODE_ENV } = process.env;
const logLevel = logConfig.level;
const logPath = path.resolve(logConfig.dir);
const tracelogPath = path.resolve(logConfig.trace_dir);
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath); 
}
if (!fs.existsSync(tracelogPath)) {
    fs.mkdirSync(tracelogPath); 
}

//log4js配置
log4js.configure({
    appenders: {
        console: { type: 'console' },
        info: {
            type: 'dateFile',
            filename: `${logPath}/info.log`,
            pattern: '.yyyy-MM-dd',
            alwaysIncludePattern: false,
        },
        onlyerror: {
            type: 'dateFile',
            filename: `${logPath}/error.log`,
            pattern: '.yyyy-MM-dd',
            alwaysIncludePattern: false,
        },
        error: { type: 'logLevelFilter', appender: 'onlyerror', level: 'error' }
    },
    categories: {
        default: { appenders: ['error', 'info', 'console'], level: logLevel },
    },
    pm2: true,
    disableClustering: true
});

// log 添加基础ctx.requestId
function getLogger(ctx) {
    const _logger = log4js.getLogger();
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    const logger = {};

    for (const method of levels) {
        logger[method] = function() {
            const args = [];
            
            for (const arg of arguments) {
                if (typeof arg === 'object' 
                    && !(arg instanceof Error)
                ) {
                    args.push(JSON.stringify(arg));
                } else {
                    args.push(arg);
                }
            }
            const message = util.format.apply(util, args);
            _logger[method].call(_logger, `${ctx.requestId} ${message}`);
        };
    }
    return logger;
}

function print(ctx, start, len, err, event) {

    // get the status code of the response
    const status = err
        ? (err.status || 500)
        : (ctx.status || 404);

    // get the human readable response length
    let length;
    if (~[204, 205, 304].indexOf(status)) {
        length = '';
    } else if (null == len) {
        length = '-';
    } else {
        length = bytes(len);
    }

    // Convert statusCode to logger level
    let loggerLevel = status < 300 ? 'info' : 'error';
    ctx.logger[loggerLevel]('-->'
        + ' ' + '%s'
        + ' ' + '%s'
        + ' ' + '%s'
        + ' ' + '%s'
        + ' ' + '%s',
        ctx.method,
        ctx.originalUrl,
        status,
        diffTime(start),
        length);
}

function diffTime(start) {
    const delta = new Date - start;
    return delta < 10000
        ? delta + 'ms'
        : Math.round(delta / 1000) + 's';
}

module.exports = () => {

    return async (ctx, next) => {
        //静态文件忽略
        if (ctx.path.indexOf('/_next/') == 0 || ctx.path.indexOf('/static/') == 0) {
            await next();
            return;
        }

        const start = new Date;
        const req_uuid = uuid();
        ctx.requestId = 'ui-common-' + (req_uuid.length > 17 ? req_uuid.slice(req_uuid.length - 17) : req_uuid);
        ctx.logger = getLogger(ctx);

        //所有请求入口
        ctx.logger.info('<--'
            + ' ' + '%s'
            + ' ' + '%s',
            ctx.method,
            ctx.originalUrl);

        await next();

        //请求返回
        const length = ctx.response.length;
        const res = ctx.res;

        const onfinish = done.bind(null, 'finish');
        const onclose = done.bind(null, 'close');

        res.once('finish', onfinish);
        res.once('close', onclose);

        function done(event) {
            res.removeListener('finish', onfinish);
            res.removeListener('close', onclose);
            print(ctx, start, length, null, event);
        }
    }
}

