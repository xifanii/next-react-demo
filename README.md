# next-react-demo

<h1 align="center">next-react-demo</h1>

<div align="center">

![](https://assets.zeit.co/image/upload/v1538361091/repositories/next-js/next-js.png)

next.js+rematch.js+koa2 🎉🎉🎉

## 框架特点

1. 自动切换服务端渲染&客户端渲染
-- next.js首屏服务端渲染，在客户端的页面跳转都是客户端渲染

2. next.js框架实现了热更新

3. 服务端代码和客户端代码分离，发出请求用的同一套代码

4. rematch数据流管理

5. 配置相关的也会存到全局model里，开放全局配置加载接口&局部配置加载接口

6. 资源缓存，生产资源加载配置到cdn，脚本可实现自动上次资源到aliyun
   --打包生成的js资源
   --static资源

7. css写法：用less

8. apidoc生成文档

9. log4js日志


</div>

- next：http://preview.pro.ant.design
- rematch：http://pro.ant.design/index-cn

## 项目结构

```bash
├── build                    # next.js打包输出文件client,server
├── bundles                  # npm run analyze生成的分析文件
├── config                   # 项目配置文件
├── log                      # koa日志
├── tracelog                 # koa错误日志
├── client
│   ├── components           # 组件
│   ├── models               # model
│   ├── pages                # 页面级container
│   ├── static               # 本地静态资源
│   ├── store                # rematch sotre middleware
│   ├── utils                # 工具库
│   ├── next.congfig.js      # next.js的配置文件
│   ├── next-env.d.ts        # next.js 类型引用
│   ├── global.less          # 全局样式
│   ├── tsconfig.json        # typescript配置文件
├── doc
│   ├── api                  # api接口生成生成器
│   ├── page                 # 页面等级文档生成器
├── server
│   ├── controllers          # koa controller
│   ├── middleware           # koa中间件
│   ├── routers              # koa2路由
│   ├── utils                # koa2工具集合
│   ├── app.js               # koa2入口文件
├── .babelrc                 # baber相关配置说明
├── .editorconfig            # 编辑器配置文件
├── package.json             # 项目信息
├── .stylelintrc             # styleint配置文件
├── .babelrc.js              # babel配置文件
├── .eslintignore            # eslint忽略配置文件
├── .eslintrc                # eslint配置文件
├── .prettierrc              # prettie配置文件
├── .postcss.config          # postcss配置
├── README.md                # 项目说明
```

## 命令说明

安装依赖。

```bash
$ npm install
```

> 如果网络状况不佳，可以使用 [cnpm](https://cnpmjs.org/) 进行加速。

开发

```bash
$ npm run dev
```

生产模式

```bash
$ npm run start
```

构建

```bash
$ npm run build
```

分析

```bash
$ npm run analyze
```

代码格式检查

```bash
$ npm run lint
```

格式自动美化

```bash
$ npm run prettier
```

## rematch 插件说明

- :loading: **自动生成 loading**: 自动为 effects 生成 loading,不用手写 loading
- :updated: **节流**: 针对 effects 进行防抖，对于高频率请求进行节流
- :immer: **immer**：reducer 中不可变数据
- :selectors: **选择器**：

## 支持环境

现代浏览器及 IE11。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## FAQ
