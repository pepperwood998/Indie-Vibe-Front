import React from 'react';

import Top from './FixedTop';
import NavMenu from './FixedNavMenu';
import QuickAccess from './FixedQuickAccess';
import Bottom from './FixedBottom';
import { UserRoute, ArtistRoute } from '../../components/custom-routes';
import { Browse, Library, Home, Account, Artist } from './monopage';
import { Workspace } from './workspace';
import { Search } from './search';

import './css/player.scss';

function Player() {
  return (
    <div className='player'>
      <div className='player__top'>
        <Top />
      </div>
      <div className='player__nav'>
        <NavMenu />
      </div>
      <div className='player__quick-access'>
        <QuickAccess />
      </div>
      <div className='player__bottom'>
        <Bottom />
      </div>
      <div className='player__content'>
        <UserRoute exact path={['/player', '/player/home']} component={Home} />
        <UserRoute path='/player/browse' component={Browse} />
        <UserRoute path='/player/library' component={Library} />
        <UserRoute path='/player/account' component={Account} />
        <UserRoute path='/player/artist' component={Artist} />
        <UserRoute path='/player/search' component={Search} />
        <ArtistRoute path='/player/workspace' component={Workspace} />
      </div>
    </div>
  );
}

export default Player;
