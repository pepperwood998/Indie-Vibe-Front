import React, { useContext, useRef, useEffect } from 'react';

import Top from './FixedTop';
import NavMenu from './FixedNavMenu';
import QuickAccess from './FixedQuickAccess';
import Bottom from './FixedBottom';
import { UserRoute, ArtistRoute } from '../../components/custom-routes';
import { Browse, Home, Account, Artist, TrackList } from './monopage';
import { Workspace } from './workspace';
import { Search } from './search';
import { Library } from './library';
import { LibraryContext } from '../../contexts';
import { ContextSwitch } from '../../components/context-menu';

import './css/player.scss';

function Player(props) {
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const menuRef = useRef();

  useEffect(() => {
    libDispatch(libActions.initCtxElem(menuRef.current));
  }, []);

  return (
    <div className='player'>
      <div className='player__top'>
        <Top history={props.history} />
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
        <UserRoute path='/player/library/:id' component={Library} />
        <UserRoute path='/player/account' component={Account} />
        <UserRoute path='/player/artist' component={Artist} />
        <UserRoute path='/player/search/:key' component={Search} />
        <UserRoute
          path='/player/release/:id'
          type='release'
          component={TrackList}
        />
        <UserRoute
          path='/player/playlist/:id'
          type='playlist'
          component={TrackList}
        />
        <ArtistRoute path='/player/workspace' component={Workspace} />
      </div>
      <div
        ref={menuRef}
        className='context-wrapper'
        style={{
          top: libState.ctxMenuPos[1] + 'px',
          left: libState.ctxMenuPos[0] + 'px'
        }}
      >
        {libState.ctxMenuOpened ? (
          <ContextSwitch content={libState.ctxMenuContent} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Player;
