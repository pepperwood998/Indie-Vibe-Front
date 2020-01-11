import React from 'react';

import RedditContainer from './RedditContainer';

function DemoComponent({ count, onIncrementClick, onDecrementClick }) {
  return (
    <div>
      <p>current count: {count}</p>
      <button onClick={onIncrementClick}>Increment</button>
      <button onClick={onDecrementClick}>Decrement</button>
      <RedditContainer />
    </div>
  );
}

export default DemoComponent;
