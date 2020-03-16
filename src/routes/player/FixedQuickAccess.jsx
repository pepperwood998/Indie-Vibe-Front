import React, { useContext, useState, useEffect } from 'react';

import { ButtonFrame } from '../../components/buttons';
import { AuthContext } from '../../contexts';
import { GroupPlaylistDialog } from '../../components/groups';

import { AddPlaylistIcon } from '../../assets/svgs';
import { LinkWhiteColor } from '../../components/links';
import { getPlaylistsMe, getPlaylistSimple } from '../../apis/API';

function QuickAccess() {
  const { state: authState } = useContext(AuthContext);
  const { role } = authState;

  const [playlists, setPlaylists] = useState([]);
  const [dialogOpened, setDialogOpened] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpened(true);
  };

  const handleCloseDialog = () => {
    setDialogOpened(false);
  };

  const handleCreatePlaylistSuccess = playlistId => {
    getPlaylistSimple(authState.token, playlistId).then(res => {
      if (res.status === 'success') {
        setPlaylists([...playlists, res.data]);
      }
    });
  };

  useEffect(() => {
    getPlaylistsMe(authState.token).then(res => {
      if (res.status === 'success') {
        setPlaylists([...playlists, ...res.data]);
      }
    });
  }, []);

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
            {playlists.map((item, index) => (
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
