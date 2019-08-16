
const NEXT_REMATCH_STORE = '__NEXT_REMATCH_STORE__';

const injectModel = lazyModel => {
  let reduxState;
  let store;
  if (process.browser) {
    store = window[NEXT_REMATCH_STORE];
    reduxState = window[NEXT_REMATCH_STORE].getState();
  } else {
    store = global[NEXT_REMATCH_STORE];
    reduxState = global[NEXT_REMATCH_STORE].getState();
  }


  lazyModel.forEach(item => {
    const { name } = item;
    if (!name) {
      console.warn('model must have a name attribute, Please check your model');
      return;
    }

    if (reduxState[name] === undefined) store.model(item);
  });
};

export default injectModel;
