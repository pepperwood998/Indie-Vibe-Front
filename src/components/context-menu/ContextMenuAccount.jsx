import React from 'react';
import { LinkWhiteColor, NavLinkColor } from '../links';

function ContextMenuAccount(props) {
  const { handlers } = props;

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const handleClose = handlers ? handlers.handleClose : () => undefined;

  return (
    <div className='context-menu' ref={props.elemRef}>
      <ul>
        <li onClick={handleClose}>
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
        <li onClick={handleClose}>
          <LinkWhiteColor
            onClick={handleLogout}
            className='font-short-regular font-weight-bold font-white'
          >
            Logout
          </LinkWhiteColor>
        </li>
      </ul>
    </div>
  );
}

export default ContextMenuAccount;
