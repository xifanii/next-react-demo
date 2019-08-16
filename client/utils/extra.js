(function(win) {
    function initBrowser() {
        return (function() {
            var win
            var nav
            var doc
            if (typeof window === 'undefined') {
                win = {}
                nav = {}
                doc = {}
            } else {
                win = window
                nav = navigator
                doc = document
            }
            return {
                win: win,
                nav: nav,
                doc: doc
            }
        })()
    }

    function getQueryParam(name, location) {
        var win = initBrowser().win
        location = location || win.location
        if (typeof location === 'undefined') {
            return null
        }
        var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)")
        var arr = (location.search || '').match(reg)
        if (arr) {
            return unescape(arr[2])
        }
        return null
    }

    //获取cookie中存储的值
    function getCookie(name) {
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        var doc = initBrowser().doc
        var arr = (doc.cookie || '').match(reg)
        if (arr) {
            return unescape(arr[2])
        }
        return null
    }
    //更新cookie中存储的值
    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    //百度小程序
    function isBaiduSmartProgram() {
        var request_from = getQueryParam('request_from') || getCookie('request_from');
        return request_from === 'baidu_sp';
    }

    //微信小程序
    function isWxSmartProgram() {
        var request_from = getQueryParam('request_from') || getCookie('request_from');
        return request_from === 'wx_sp';
    }

    //在script标签中添加js
    function createJavaScript(js, next, list) {
        var jsElement = document.createElement('script');
        jsElement.src = js;
        jsElement.async = true;
        jsElement.onload = function() {
            next && next(list);
        }
        document.head.appendChild(jsElement);
    }

    function appendJS(js) {
        if (typeof(js) == "string") {
            createJavaScript(js);
        } else {
            if (js.length > 0) {
                createJavaScript(js.shift(), appendJS, js);
            }
        }
    }


    var extra = {}
    extra.getQueryParam = getQueryParam;
    extra.getCookie = getCookie;
    extra.createCookie = createCookie;
    extra.isBaiduSP = isBaiduSmartProgram;
    extra.isWxSP = isWxSmartProgram;
    extra.appendJS = appendJS;

    win.EXTRA = extra;

})(window)