import React, { useContext, useState, useEffect } from 'react';

import { ButtonFrame, ButtonLoadMore } from '../../components/buttons';
import { AuthContext, LibraryContext } from '../../contexts';
import { GroupPlaylistDialog } from '../../components/groups';
import { LinkWhiteColor } from '../../components/links';
import { getPlaylistsMe, getPlaylistSimple } from '../../apis/API';

import { AddPlaylistIcon } from '../../assets/svgs';
import { useEffectSkip } from '../../utils/Common';

function QuickAccess() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);
  const { role } = authState;

  const [dialogOpened, setDialogOpened] = useState(false);

  useEffect(() => {
    getPlaylistsMe(authState.token).then(res => {
      if (res.status === 'success' && res.data) {
        libDispatch(libActions.setMyPlaylists(res.data));
      }
    });
  }, []);

  let playlists = libState.myPlaylists;

  const handleOpenDialog = () => {
    setDialogOpened(true);
  };

  const handleCloseDialog = () => {
    setDialogOpened(false);
  };

  const handleCreatePlaylistSuccess = playlistId => {
    getPlaylistSimple(authState.token, playlistId).then(res => {
      if (res.status === 'success') {
        libDispatch(libActions.createPlaylist(res.data));
      }
    });
  };

  const handleLoadMore = () => {
    getPlaylistsMe(authState.token, playlists.offset + playlists.limit).then(
      res => {
        if (res.status === 'success' && res.data.items) {
          libDispatch(libActions.loadMorePlaylists(res.data));
        }
      }
    );
  };

  return (
    <div className='quick-access'>
      {dialogOpened ? (
        <GroupPlaylistDialog
          handleCloseDialog={handleCloseDialog}
          handleCreatePlaylistSuccess={handleCreatePlaylistSuccess}
        />
      ) : (
        ''
      )}
      <div className='quick-access__role'>
        <RoleBanner role={role} />
      </div>
      <div className='quick-access__playlists'>
        <div className='banner'>
          <span className='font-short-regular font-gray-light'>Playlists</span>
          <AddPlaylistIcon
            className='svg--regular svg--cursor svg--scale'
            onClick={handleOpenDialog}
          />
        </div>
        <div className='content-wrapper'>
          <ul className='content'>
            {playlists.items.map((item, index) => (
              <li className='item-wrapper' key={index}>
                <LinkWhiteColor
                  href={`/player/playlist/${item.id}`}
                  className='item font-short-big font-weight-bold'
                  nav={true}
                >
                  {item.title}
                </LinkWhiteColor>
              </li>
            ))}
          </ul>
          {playlists.total > playlists.offset + playlists.limit ? (
            <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

function RoleBanner(props) {
  const { role } = props;
  switch (role) {
    case 'r-free':
      return (
        <a href='/home/premium' className='role-free'>
          <ButtonFrame isFitted={true}>Upgrade</ButtonFrame>
        </a>
      );
    case 'r-premium':
      return (
        <div className='role-premium font-short-big font-white font-weight-bold'>
          Premium
        </div>
      );
    case 'r-artist':
      return (
        <div className='role-artist font-short-big font-white font-weight-bold'>
          Artist
        </div>
      );
  }
}

export default QuickAccess;
