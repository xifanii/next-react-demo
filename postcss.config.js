const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    pxtorem({
      rootValue: 75,
      unitPrecision: 5,
      propList: ['*'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    })
  ]
};
