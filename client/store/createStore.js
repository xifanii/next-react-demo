import { init } from '@rematch/core';
import { combineReducers } from 'redux';
import immerPlugin from '@rematch/immer';
import selectorsPlugin from '@rematch/select';
import updatedPlugin from '@rematch/updated';
import createLoadingPlugin from '@rematch/loading';

import logSlowReducers from './middleware/logSlowlyReducers';
import * as models from '../models';


const loading = createLoadingPlugin();
const updated = updatedPlugin();

const state = {};

const initializeStore = (initialState = state, lazyModel = []) => {
  if (Array.isArray(lazyModel) && lazyModel.length > 0) {
    lazyModel.filter(({ name }) => name === undefined || name === null)
  }
  return init({
    models: {
      ...models,
      ...lazyModel,
    },
    redux: {
      initialState,
      devtoolOptions: {
        name: 'ui-common-next'
      },
      // middlewares: [logger],
      // enhancers: [logSlowReducers],
      combineReducers: reducers => combineReducers(logSlowReducers(reducers)),
    },
    plugins: [loading, updated, immerPlugin, selectorsPlugin],
  });
}
export default initializeStore;
