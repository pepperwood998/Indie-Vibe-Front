import React, { useContext } from 'react';

import { LinkWhiteColor } from '../links';
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
        <LinkWhiteColor href='/player/account' className='font-regular font-white'>
          Account
        </LinkWhiteColor>
      </li>
      <li>
        <LinkWhiteColor onClick={handleLogout} className='font-regular font-white'>
          Logout
        </LinkWhiteColor>
      </li>
    </ul>
  );
}

export default AccountContextMenu;
