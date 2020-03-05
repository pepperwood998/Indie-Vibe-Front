import React from 'react';
import { UserRoute } from '../../components/custom-routes';

import './player.scss';
import Top from './Top';
import NavBar from './NavBar';
import QuickAccess from './QuickAccess';
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
      <div className='player__quick-access'>
        <QuickAccess />
      </div>
      <div className='player__bottom'></div>
      <div className='player__content'>
        <UserRoute
          exact
          path={['/player', '/player/home']}
          component={Home}
        ></UserRoute>
        <UserRoute path='/player/browse' component={Browse}></UserRoute>
        <UserRoute path='/player/browse' component={Library}></UserRoute>
        <UserRoute path='/player/account' component={Account}></UserRoute>
        <UserRoute path='/player/artist' component={Artist}></UserRoute>
        <UserRoute path='/player/search' component={Search}></UserRoute>
      </div>
    </div>
  );
}

export default Player;
