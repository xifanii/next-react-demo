import React from 'react';
import Router from 'next/router';
import App, { Container } from 'next/app';
import ErrorBoundary from '@/components/_global/ErrorBoundary';

export default class RootApp extends App {
  componentDidMount() {
    this.clientPageScriptOnload();
    Router.onRouteChangeComplete = () => {
      this.clientPageScriptOnload();
    };
  }


  clientPageScriptOnload = () => {

  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </Container>
    );
  }
}
