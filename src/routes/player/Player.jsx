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
import { LibraryContext, AuthContext } from '../../contexts';
import { ContextSwitch } from '../../components/context-menu';
import { CollectionMain } from '../../components/collections';
import { CloseIcon } from '../../assets/svgs';
import { CardSuccess, CardError } from '../../components/cards';
import { getPlaylistsMe } from '../../apis/API';
import { ButtonLoadMore } from '../../components/buttons';

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
        <QuickAccess history={props.history} />
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
      {libState.browsePlaylists.opened ? <BrowsePlaylist /> : ''}
      {libState.notification.opened ? <Notification /> : ''}
    </div>
  );
}

function BrowsePlaylist() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const { myPlaylists } = libState;
  const myOwnPlaylists = myPlaylists.items.filter(item =>
    item.relation.includes('own')
  );

  const handleLoadMore = () => {
    getPlaylistsMe(
      authState.token,
      myPlaylists.offset + myPlaylists.limit
    ).then(res => {
      if (res.status === 'success' && res.data.items) {
        libDispatch(libActions.loadMorePlaylists(res.data));
      }
    });
  };

  return (
    <div className='screen-overlay'>
      <CloseIcon
        className='close svg--cursor svg--scale'
        onClick={() => {
          libDispatch(libActions.setBrowsePlaylists(false, ''));
        }}
      />
      <div className='browse-playlists'>
        <CollectionMain
          header={<span>Choose playlist</span>}
          items={myOwnPlaylists}
          type='browse-playlist'
        />
      </div>
      {myPlaylists.total > myPlaylists.offset + myPlaylists.limit ? (
        <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
      ) : (
        ''
      )}
    </div>
  );
}

function Notification() {
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const { notification } = libState;
  let timeout;

  useEffect(() => {
    clearTimeout(timeout);
    if (notification.opened)
      timeout = setTimeout(() => {
        libDispatch(libActions.setNotification(false));
      }, 2000);
  });

  return (
    <div className='action-notification'>
      {notification.success ? (
        <CardSuccess message={notification.message} />
      ) : (
        <CardError message={notification.message} />
      )}
    </div>
  );
}

export default Player;
