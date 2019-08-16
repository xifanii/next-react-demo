const _regexAbs = new RegExp('^(http|https|ftp|sftp|file)://([^/:]+)(?::(\\d+))?([^?#]*)(\\?[^#]*)?(#.*)?$', 'i');

const _noNull = function (str) {
    if (typeof str === 'string')
        return str;
    else
        return '';
};


const Urls = {

    rootPath: function (depth) {
        if (typeof (depth) !== 'number'
            || depth < 0)
            throw "IllegalArgumentException: depth must be a non-negative integer.";

        const path = window.location.pathname,
            idx = -1;

        for (const cnt = 0; cnt <= depth; cnt++) {
            idx = path.indexOf('/', idx + 1);
            if (idx < 0)
                idx = path.length - 1;
        }

        return path.substring(0, idx + 1);
    },

    queryStringParam: function (name, defaultValue) {

        if (typeof name !== 'string'
            || name === '')
            throw "IllegalArgumentException: name must be a non-empty String.";

        const regex = new RegExp('[\\?&]' + name + '=([^&]*)'),
            match = regex.exec(window.location.search);

        if (match !== null)
            return match[1];
        else if (typeof defaultValue === 'string')
            return defaultValue;
        else
            return null;

    },

    addURLParam: function (url, name, val) {
        if (typeof name === 'object') {

            for (const key in name) {
                if (name.hasOwnProperty(key))
                    url = Urls.addURLParam(url, key, name[key]);
            }
        }

        else {
            url += ((url.indexOf("?") === -1)
                ? '?'
                : '&');
            url += encodeURIComponent(name)
                + "="
                + encodeURIComponent(val);
        }

        return url;
    },

    /**
     * Returns the equivalent of the JavaScript <code>location</code> object.
     * @see http://www.w3schools.com/jsref/obj_location.asp
     */
    info: function (url) {

        const m = _regexAbs.exec(url);
        if (m === null)
            return null;

        else {

            const o = {
                hash: _noNull(m[6]),
                host: null,
                hostname: _noNull(m[2]),
                href: url,
                pathname: _noNull(m[4]),
                port: _noNull(m[3]),
                protocol: _noNull(m[1]),
                search: _noNull(m[5])
            };

            o.host = o.hostname;
            if (o.port !== '')
                o.host += ':' + o.port;

            return o;
        }
    }
};

export default Urls;
