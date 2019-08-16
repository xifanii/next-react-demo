import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage(App => props =>
      <App {...props} />
    );

    return { ...page };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="renderer" content="webkit" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Cache-Control" content="no-cache" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="Expires" content="-1" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <link rel="icon" href="data:;base64,=" />
          <link rel="stylesheet" type="text/css" href={`${process.env.STATIC_PREFIX}/static/css/reset.css`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
