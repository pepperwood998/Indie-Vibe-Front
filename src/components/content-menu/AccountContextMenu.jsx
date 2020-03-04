import React, { useContext } from 'react';

import { LinkColor } from '../links';
import { AuthContext } from '../../contexts';

function AccountContextMenu() {
  const { actions: authAction, dispatch: authDispatch } = useContext(
    AuthContext
  );

  const handleLogout = () => {
    console.log('a');
    // call back-end api
    // if logout request get a success response
    authDispatch(authAction.logout());
  };

  return (
    <ul className='context-menu d-flex flex-column'>
      <li>
        <LinkColor label='Account' href='/player/account' />
      </li>
      <li>
        <LinkColor label='Logout' onClick={handleLogout} />
      </li>
    </ul>
  );
}

export default AccountContextMenu;
