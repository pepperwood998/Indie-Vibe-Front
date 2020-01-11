import { combineReducers } from 'redux';

import demoReducer from './app/demo/duck';

const rootReducer = combineReducers({
  demo: demoReducer
});

export default rootReducer;
