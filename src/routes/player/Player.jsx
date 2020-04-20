import React, { useContext, useEffect, useRef } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  getGenresList,
  getPlaylistsMeOwn,
  getReleaseTypeList
} from '../../apis/API';
import { CloseIcon } from '../../assets/svgs';
import { ButtonLoadMore } from '../../components/buttons';
import { CardError, CardSuccess } from '../../components/cards';
import { CollectionMain } from '../../components/collections';
import { ContextSwitch } from '../../components/context-menu';
import { RouteAuthorized } from '../../components/custom-routes';
import {
  GroupConfirmDialog,
  GroupGenreDialog,
  GroupPlaylistDialog,
  GroupTrackCredits
} from '../../components/groups';
import { ROUTES } from '../../config/RoleRouting';
import { AuthContext, LibraryContext } from '../../contexts';
import { Account } from './account';
import { Artist } from './artist';
import { Browse, BrowseGenre, BrowseGenreType } from './browse';
import './css/player.scss';
import Bottom from './FixedBottom';
import NavMenu from './FixedNavMenu';
import QuickAccess from './FixedQuickAccess';
import Top from './FixedTop';
import { Library } from './library';
import { Home, Playlist, Queue, Release } from './monopage';
import { Search } from './search';
import { Manage, Workspace } from './workspace';

function Player(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const menuRef = useRef();
  const { player } = ROUTES;

  useEffect(() => {
    libDispatch(libActions.initCtxElem(menuRef.current));

    getReleaseTypeList(authState.token).then(res => {
      if (res.status === 'success') {
        libDispatch(libActions.setReleaseTypes(res.data));
      }
    });

    getGenresList(authState.token).then(res => {
      if (res.status === 'success') {
        libDispatch(libActions.setGenres(res.data));
      }
    });
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
        <Switch>
          <RouteAuthorized
            exact
            component={Home}
            path={player.home[0]}
            roleGroup={player.home[1]}
          />
          <RouteAuthorized
            component={Browse}
            path={player.browse.general[0]}
            roleGroup={player.browse.general[1]}
          />
          <RouteAuthorized
            component={Library}
            path={player.library.general[0]}
            roleGroup={player.library.general[1]}
          />
          <RouteAuthorized
            component={Search}
            path={player.search.general[0]}
            roleGroup={player.search.general[1]}
          />
          <RouteAuthorized
            component={Workspace}
            path={player.workspace.releases[0]}
            roleGroup={player.workspace.releases[1]}
          />
          <RouteAuthorized
            component={Account}
            path={player.account.info[0]}
            roleGroup={player.account.info[1]}
          />
          <RouteAuthorized
            exact
            component={BrowseGenre}
            path={player.genre[0]}
            roleGroup={player.genre[1]}
          />
          <RouteAuthorized
            exact
            component={BrowseGenreType}
            path={player.genreType[0]}
            roleGroup={player.genreType[1]}
          />
          <RouteAuthorized
            component={Artist}
            path={player.artist.discography[0]}
            roleGroup={player.artist.discography[1]}
          />
          <RouteAuthorized
            component={Release}
            path={player.release[0]}
            roleGroup={player.release[1]}
          />
          <RouteAuthorized
            component={Playlist}
            path={player.playlist[0]}
            roleGroup={player.playlist[1]}
          />
          <RouteAuthorized
            component={Queue}
            path={player.queue[0]}
            roleGroup={player.queue[1]}
          />
          <RouteAuthorized
            component={Manage}
            path={player.manage[0]}
            roleGroup={player.manage[1]}
          />
          <Route path='*'>
            <Redirect to='/404' />
          </Route>
        </Switch>
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
          <ContextSwitch
            content={libState.ctxMenuContent}
            pos={libState.ctxMenuPos}
          />
        ) : (
          ''
        )}
      </div>
      {libState.browsePlaylists.opened ? <BrowsePlaylist /> : ''}
      {libState.editPlaylist.opened ? (
        <GroupPlaylistDialog history={props.history} />
      ) : (
        ''
      )}
      {libState.trackCredits.opened ? <GroupTrackCredits /> : ''}
      {libState.confirmDialog.opened ? <GroupConfirmDialog /> : ''}
      {libState.genresDialog.opened ? <GroupGenreDialog /> : ''}
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
    getPlaylistsMeOwn(
      authState.token,
      myPlaylists.offset + myPlaylists.limit
    ).then(res => {
      if (res.status === 'success' && res.data.items) {
        libDispatch(libActions.loadMorePlaylists(res.data));
      }
    });
  };

  return (
    <div className='screen-overlay browse-playlists fadein'>
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
          generalType='browse-playlist'
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

export function Notification() {
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
      }, 1500);
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
