import React from 'react';
import { Route } from 'react-router-dom';

import './player.scss';
import Top from './Top';
import NavBar from './NavBar';
import { Browse, Library, Home, Account, Artist, Search } from './pages';

function Player() {
  return (
    <div className='player'>
      <div className='player__top'>
        <Top />
      </div>
      <div className='player__nav'>
        <NavBar />
      </div>
      <div className='player__quick-access'></div>
      <div className='player__bottom'></div>
      <div className='player__content'>
        <Route
          exact
          path={['/player', '/player/home']}
          component={Home}
        ></Route>
        <Route path='/player/browse' component={Browse}></Route>
        <Route path='/player/browse' component={Library}></Route>
        <Route path='/player/account' component={Account}></Route>
        <Route path='/player/artist' component={Artist}></Route>
        <Route path='/player/search' component={Search}></Route>
      </div>
    </div>
  );
}

export default Player;
