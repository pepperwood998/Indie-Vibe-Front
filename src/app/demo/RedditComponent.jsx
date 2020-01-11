import React from 'react';

function RedditComponent({
  subredditData,
  showRedditSpinner,
  fetchSubreddits
}) {
  if (showRedditSpinner) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {subredditData.map((data, index) => (
        <li key={index}>
          <a href={`https://reddit.com${data.url}`} target='_blank'>
            {data.title}
          </a>
        </li>
      ))}
      <button onClick={() => fetchSubreddits('reactjs')}>
        Show ReactJS subreddits
      </button>
    </ul>
  );
}

export default RedditComponent;
