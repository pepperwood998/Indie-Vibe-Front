import fetch from 'cross-fetch';

import Creators from './actions';

const {
  incrementCount,
  decrementCount,
  requestSubredditJson,
  receiveSubredditJson
} = Creators;

const fetchSubredditJson = subreddit => {
  return dispatch => {
    dispatch(requestSubredditJson(subreddit));
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => {
        let data = [];

        json.data.children.map(child => {
          const childData = {
            title: child.data.title,
            url: child.data.permalink
          };

          data.push(childData);
          return null;
        });

        console.log('aaaaa');
        dispatch(receiveSubredditJson(data));
      });
  };
};

export default {
  incrementCount,
  decrementCount,
  fetchSubredditJson
};
