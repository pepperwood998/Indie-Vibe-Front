import React, { useContext } from 'react';

import { LinkWhiteColor, NavLinkColor } from '../links';
import { AuthContext } from '../../contexts';

function AccountContextMenu(props) {
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
        {props.fromLanding ? (
          <LinkWhiteColor
            href='/player/account'
            className='font-short-regular font-weight-bold font-white'
          >
            Account
          </LinkWhiteColor>
        ) : (
          <NavLinkColor
            href='/player/account'
            className='font-short-regular font-weight-bold font-white'
          >
            Account
          </NavLinkColor>
        )}
      </li>
      <li>
        <LinkWhiteColor
          onClick={handleLogout}
          className='font-short-regular font-weight-bold font-white'
        >
          Logout
        </LinkWhiteColor>
      </li>
    </ul>
  );
}

export default AccountContextMenu;
