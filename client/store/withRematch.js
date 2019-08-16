/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Provider, connect } from 'react-redux';
import initializeStore from './createStore';
import injectModel from './injectModel';
import enhanceContent from './enhanceContent';

const checkServer = () => Object.prototype.toString.call(global.process) === '[object process]';

const __NEXT_REMATCH_STORE__ = '__NEXT_REMATCH_STORE__';

const getOrCreateStore = (lazyModel, initialState) => {
  const isServer = checkServer();
  if (isServer) {
    return initializeStore(initialState, lazyModel);
  }

  // Memoize store in global variable if client
  if (!window[__NEXT_REMATCH_STORE__]) {
    window[__NEXT_REMATCH_STORE__] = initializeStore(initialState, lazyModel);
  }
  return window[__NEXT_REMATCH_STORE__];
};


export default (...args) => Component => {
  const [mapStateToProps, mapDispatchToProps, ...lazyModel] = args;
  const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(Component);

  return class ComWithRematch extends React.Component {
    static async getInitialProps(appContext) {
      const store = getOrCreateStore(lazyModel);
      const isServer = !process.browser;
      if (!isServer && Array.isArray(lazyModel)) injectModel(lazyModel);
      // 将sotre挂在getInitialProps的参数中
      appContext.store = store;

      appContext = await enhanceContent(appContext, isServer);

      let appProps = {};
      if (typeof Component.getInitialProps === 'function') {
        appProps = await Component.getInitialProps(appContext);
      }
      return {
        ...appProps,
        initialReduxState: store.getState()
      };
    }

    constructor(props) {
      super(props);
      this.store = getOrCreateStore(lazyModel, props.initialReduxState);
    }

    render() {
      const { pageProps } = this.props;
      return (
        <Provider store={this.store}>
          <ConnectedComponent {...pageProps} />
        </Provider>
      );
    }
  };
};
