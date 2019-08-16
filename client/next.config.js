const withLess = require('@zeit/next-less');
// const nextBuildId = require('next-build-id');
const withProgressBar = require('next-progressbar');
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const fromPackage = require('../package.json').version;

const isProd = process.env.NODE_ENV === 'production';

if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => { };
}

const nextConfig = {
  distDir: '../build',
  generateBuildId: async () => {
    return fromPackage;
  },
  assetPrefix: isProd ? 'https://storage-node.ipin.com/modules' : '',
};


const nextLessConfig = {
  cssModules: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};

const nextAnalyzerConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  }
};

const envConfig = {
  env: {
    STATIC_PREFIX: isProd ? 'https://storage-node.ipin.com/modules' : '',
  }
};

// const nextPWAconfig = {
//   target: process.env.NEXT_TARGET || 'serverless',
//   workboxOpts: {
//     swDest: 'static/service-worker.js',
//     runtimeCaching: [
//       {
//         urlPattern: /[.](png|jpg|ico|css)/,
//         handler: 'CacheFirst',
//         options: {
//           cacheName: 'assets-cache',
//           cacheableResponse: {
//             statuses: [0, 200]
//           }
//         }
//       },
//       {
//         urlPattern: /^https:\/\/code\.getmdl\.io.*/,
//         handler: 'CacheFirst',
//         options: {
//           cacheName: 'lib-cache'
//         }
//       },
//       {
//         urlPattern: /^http.*/,
//         handler: 'NetworkFirst',
//         options: {
//           cacheName: 'http-cache'
//         }
//       }
//     ]
//   }
// };


const config = Object.assign(nextConfig, nextAnalyzerConfig, nextLessConfig, envConfig);
module.exports = withProgressBar(withLess(withBundleAnalyzer(config)));
