
export function queryStringify(obj) {
    if (!isObjectType(obj)) {
        return '';
    }

    const keys = Object.keys(obj);

    let ret = '';

    keys.map(item => {
        if (obj[item]) {
            ret += `${item}=${obj[item]}&`;
        }
    });

    return ret.replace(/&$/, '');
}

export function formatPercentNum(num) {
    if (num > 0) {
        return `${Math.min(99, Math.round(num * 100)).toString()}%`;
    }
    return '-';
}

/**
 * judge if iOS
 * @return {boolean}
 */
export function isiOS() {
    const iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ];

    if (navigator.platform) {
        while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) {
                return true;
            }
        }
    }

    return false;
}

export function isPc() {
    return !navigator.userAgent.match(/(Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|SymbianOS|Windows Phone)/i);
}

export function isIPhoneX() {
    if (isiOS()) {
        return (screen.height === 812 && screen.width === 375) ||
            (screen.height === 896 && screen.width === 414);
    }
    return false;
}

export function isInApp() {
    let win; let nav; let
        doc;
    if (typeof window === 'undefined') {
        win = {};
        nav = {};
        doc = {};
    } else {
        win = window;
        nav = navigator;
        doc = document;
    }

    const isOldAppInios = (function () {
        return (/\biOSAppWebView\b/i).test(nav.userAgent);
    }());
    const isOldAppInAndroid = (function () {
        return !!win.NativeController;
    }());
    const isInnerApp = (function () {
        return (/\wmzyApp\b/i).test(nav.userAgent);
    }());

    if (isInnerApp || isOldAppInios || isOldAppInAndroid) {
        return true;
    }
    return false;
}

/**
 * 键盘弹起和缩起事件处理
 * @type {{popupCallBack:键盘弹出回调, packupCallBack：键盘收起回调}}
 */
export function keyboardHelper(popupCallBack, packupCallBack) {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = () => {
        const nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (clientHeight > nowClientHeight) {
            // 键盘弹出的事件处理
            popupCallBack();
        } else {
            packupCallBack();
        }
    };
}

/**
 * iOS键盘弹出后收起影响界面元素热点问题修复
 */
export function keyboardFix() {
    if (isiOS()) {
        window.setTimeout(() => {
            window.scrollTo(0, document.body.clientHeight);
        }, 500);
    }
}

/**
 * 滑动穿透fix
 * @type {{afterOpen, beforeClose}}
 */
export function modalHelper() {
    let scrollTop;

    return {
        afterOpen() {
            scrollTop = document.scrollingElement.scrollTop;

            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            // document.body.style.top      = -scrollTop + 'px';
        },
        beforeClose() {
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            // scrollTop lost after set position:fixed, restore it back.
            document.scrollingElement.scrollTop = scrollTop;
        }
    };
}

export function modalHelperAfterOpen() {
    const { scrollTop } = document.scrollingElement;

    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `${-scrollTop}px`;
}

export function modalHelperBeforeClose() {
    const { scrollTop } = document.scrollingElement;

    document.body.style.position = 'static';
    document.body.style.width = 'auto';
    // scrollTop lost after set position:fixed, restore it back.
    document.scrollingElement.scrollTop = scrollTop;
}

// app.ept.openWebView url host部分
export function hoster() {
    const { hostname, port, protocol } = location;
    return `${protocol}//${hostname}${port ? (`:${port}`) : ''}`;
}

// 手机号码隐私化
export function privatePhoneNum(phone) {
    phone = phone || '';
    if (phone.length == 11) {
        phone = phone.replace(phone.substr(3, 4), '****');
    }
    return phone;
}