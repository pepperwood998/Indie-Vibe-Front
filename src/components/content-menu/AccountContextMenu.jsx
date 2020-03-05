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
        <LinkColor href='/player/account' className='font-regular font-white'>
          Account
        </LinkColor>
      </li>
      <li>
        <LinkColor onClick={handleLogout} className='font-regular font-white'>
          Logout
        </LinkColor>
      </li>
    </ul>
  );
}

export default AccountContextMenu;
