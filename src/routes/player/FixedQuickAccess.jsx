import React, { useContext, useState } from 'react';

import { ButtonFrame } from '../../components/buttons';
import { AuthContext } from '../../contexts';
import { GroupPlaylistDialog } from '../../components/groups';

import { AddPlaylistIcon } from '../../assets/svgs';

function QuickAccess() {
  const { state: authState } = useContext(AuthContext);
  const { role } = authState;

  const [dialogOpened, setDialogOpened] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpened(true);
  };

  const handleCloseDialog = () => {
    setDialogOpened(false);
  };

  return (
    <div className='quick-access'>
      {dialogOpened ? (
        <GroupPlaylistDialog handleCloseDialog={handleCloseDialog} />
      ) : (
        ''
      )}
      <div className='quick-access__role'>
        <RoleBanner role={role} />
      </div>
      <div className='quick-access__playlists'>
        <div className='banner'>
          <span className='font-short-regular font-gray-light'>Playlists</span>
          <AddPlaylistIcon onClick={handleOpenDialog} />
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
