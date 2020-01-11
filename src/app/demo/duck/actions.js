import types from './types';

const incrementCount = value => {
  return {
    type: types.INCREMENT_COUNT,
    value
  };
};

const decrementCount = value => {
  return {
    type: types.DECREMENT_COUNT,
    value
  };
};

const requestSubredditJson = subreddit => {
  return {
    type: types.REQUEST_SUBREDDIT_JSON,
    subreddit
  };
};

const receiveSubredditJson = subredditData => {
  return {
    type: types.RECEIVE_SUBRREDIT_JSON,
    subredditData
  };
};

export default {
  incrementCount,
  decrementCount,
  requestSubredditJson,
  receiveSubredditJson
};
