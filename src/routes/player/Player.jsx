import React from 'react';
import { BrowserRouter } from 'react-router-dom';
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
        <BrowserRouter basename='/player'>
          <UserRoute
            exact
            path={['/', '/home']}
            component={Home}
          ></UserRoute>
          <UserRoute path='/browse' component={Browse}></UserRoute>
          <UserRoute path='/browse' component={Library}></UserRoute>
          <UserRoute path='/account' component={Account}></UserRoute>
          <UserRoute path='/artist' component={Artist}></UserRoute>
          <UserRoute path='/search' component={Search}></UserRoute>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Player;
