import { connect } from 'react-redux';

import RedditComponent from './RedditComponent';
import { demoOperations } from './duck';

const mapStateToProps = state => {
  const { subredditData, showRedditSpinner } = state.demo;
  return {
    subredditData,
    showRedditSpinner
  };
};

const mapDispatchToProps = dispatch => {
  const fetchSubreddits = subreddit => {
    dispatch(demoOperations.fetchSubredditJson(subreddit));
  };

  return { fetchSubreddits };
};

const RedditContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RedditComponent);

export default RedditContainer;
