const fabric = require('@umijs/fabric');

const fabriclint = { ...fabric.eslint };
fabriclint.rules = Object.assign(
  fabriclint.rules, {
    // 允许使用require()
     "global-require": 0,
    // 使用双==警告
    "eqeqeq": 1,
    // 修改参数会得到警告
    "no-param-reassign": 0,
    "no-return-await": 1,
    // 未使用已定义变量报错
    "no-unused-vars": 2,
    // 不要使用index索引作为react的key  
    "react/no-array-index-key": 2,
    // 可以使用require引用规则
    "@typescript-eslint/no-var-requires": 0,
    // 未使用已定义变量报错
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "ignoreRestSiblings": false
    }]
  })


module.exports = fabriclint;
