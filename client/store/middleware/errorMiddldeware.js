const errorMiddldeware = handler => store => next => async action => {
  try {
    return await next(action);
  } catch (e) {
    store.dispatch(handler(e, action));
    return e;
  }
};

const errorHandler = (e, lastAction) => (dispatch, getState) => {
  switch (e.status) {
    case 401: {
      console.error(e);
      break;
    }

    default: {
      console.error(e);
    }
  }
};

export default errorMiddldeware(errorHandler);
