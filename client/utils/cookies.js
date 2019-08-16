var Cookies = {

  _getOptions: function (options) {

    if (typeof options === 'undefined')
      options = {};

    else if (options === null
      || typeof options !== 'object')
      throw "IllegalArgumentException: options must be an Object.";

    return options;
  },

  /**
   * Sets a cookie item.
   * 
   * @param name (String)
   * @param value (String or Number)
   * @param options (Object, optional)
   */
  set: function (name, value, options) {

    if (typeof name !== 'string'
      || name === '')
      throw "IllegalArgumentException: name must be a non-empty String.";

    if (typeof value !== 'string'
      && typeof value !== 'number')
      throw "IllegalArgumentException: value must be a String or Number.";

    options = Cookies._getOptions(options);

    var expires = '',
      exp = options.millisExpire;

    if (typeof exp !== 'undefined') {
      if (typeof exp !== 'number')
        throw "IllegalArgumentException: options.millisExpire must be a Number.";

      var expDt = new Date();
      expDt.setTime(expDt.getTime() + exp);
      expires = '; expires=' + expDt.toGMTString();
    }

    var domain = '',
      optDomain = options.domain;

    if (typeof optDomain !== 'undefined') {
      if (typeof optDomain !== 'string')
        throw "IllegalArgumentException: options.domain must be a String.";

      domain = '; domain=' + optDomain;
    }

    var pathPrefix = '; path=',
      optPath = options.path,
      path;

    if (typeof optPath !== 'undefined') {
      if (typeof optPath !== 'string')
        throw "IllegalArgumentException: options.path must be a String.";

      path = pathPrefix + optPath;
    }
    else
      path = pathPrefix + '/';    // Use root by default.

    document.cookie = name + '=' + encodeURIComponent(value)
      + expires
      + domain
      + path;
  },

  remove: function (name, options) {
    options.millisExpire = -1;

    Cookies.set(name, '', options);
  },

  get: function (name) {
    if (typeof name !== 'string'
      || name === '')
      throw "IllegalArgumentException: name must be a non-empty String.";

    var regex = new RegExp('(?:^|;) ?' + name + '=([^;]*)', 'gi'),
      match = regex.exec(document.cookie);

    if (match !== null)
      return decodeURIComponent(match[1]);
    else
      return null;
  }
};


export default Cookies;