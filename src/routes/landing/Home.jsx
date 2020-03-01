import React from 'react';

import './style.scss';

function Home() {
  return (
    <div id='home'>
      <ul>
        <li>
          <a href='/home'>Home</a>
        </li>
        <li>
          <a href='/login'>Login</a>
        </li>
        <li>
          <a href='/register'>Register</a>
        </li>
        <li>
          <a href='/player'>Player</a>
        </li>
      </ul>
    </div>
  );
}

export default Home;
