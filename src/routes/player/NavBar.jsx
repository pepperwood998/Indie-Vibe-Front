import React, { useContext, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { NavLinkColor, NavLinkUnderline } from '../../components/links';
import { AccountContextMenu } from '../../components/content-menu';
import { MeContext, AuthContext } from '../../contexts';
import { getMeSimple } from '../../apis';

import {
  HomeIcon,
  BrowseIcon,
  LibraryIcon,
  SettingIcon
} from '../../assets/svgs';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { ButtonFrame } from '../../components/buttons';

function NavBar() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);

  useEffect(() => {
    if (!meState.id) {
      getMeSimple(authState.token)
        .then(response => response.json())
        .then(json => {
          if (json.status === 'success') {
            meDispatch(meActions.loadMe(json.data));
          }
        });
    }
  });

  return (
    <div className='nav-menu'>
      <div className='user-box'>
        <div className='avatar-box'>
          <img
            src={meState.thumbnail ? meState.thumbnail : AvatarPlaceholder}
          />
          <div className='avatar-box__layer'>
            <SettingIcon data-toggle='dropdown' />
            <div className='dropdown-menu'>
              <AccountContextMenu fromLanding={false} />
            </div>
          </div>
        </div>
        <span className='user-title'>
          <NavLinkUnderline
            href='/player/account'
            className='font-short-regular font-weight-bold font-white'
          >
            {meState.displayName}
          </NavLinkUnderline>
        </span>
      </div>
      <ul className='menu'>
        <li>
          <NavLinkColor
            href='/player/home'
            className='font-short-big font-weight-bold font-white'
          >
            <HomeIcon />
            Home
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor
            href='/player/browse'
            className='font-short-big font-weight-bold font-white'
          >
            <BrowseIcon />
            Browse
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor
            href='/player/library'
            className='font-short-big font-weight-bold font-white'
          >
            <LibraryIcon />
            Library
          </NavLinkColor>
        </li>
      </ul>
      <div className='quick-menu'>
        <Link
          to='/player/library/artists'
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Artist
        </Link>
        <Link
          to='/player/library/albums'
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Albums
        </Link>
        <Link
          to='/player/library/favorite'
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Favorite songs
        </Link>
      </div>
      <div className='artist-box'>
        {authState.role === 'r-artist' ? (
          <NavLink to='/player/workspace'>
            <ButtonFrame>Your workspace</ButtonFrame>
          </NavLink>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default NavBar;
