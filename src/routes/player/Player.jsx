import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import { HomePlayer } from './home';
import { Browse } from './browse';

function Player() {
  return (
    <div>
      <ul>
        <li>
          <NavLink to='/player/home'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/player/browse'>Browse</NavLink>
        </li>
        <li>
          <a href='/home'>Index</a>
        </li>
      </ul>
      <Route
        exact
        path={['/player', '/player/home']}
        component={HomePlayer}
      ></Route>
      <Route path='/player/browse' component={Browse}></Route>
    </div>
  );
}

export default Player;
