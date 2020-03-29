import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAccount } from '../../apis/API';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import {
  BrowseIcon,
  HomeIcon,
  LibraryIcon,
  SettingIcon
} from '../../assets/svgs';
import { ButtonFrame } from '../../components/buttons';
import { ContextMenuAccount } from '../../components/context-menu';
import { NavLinkColor, NavLinkUnderline } from '../../components/links';
import { AuthContext, MeContext } from '../../contexts';

function NavMenu() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);

  useEffect(() => {
    if (!meState.id) {
      getAccount(authState.token).then(json => {
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
              <ContextMenuAccount fromLanding={false} />
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
            href={['/player', '/player/home']}
            className='font-short-big font-weight-bold font-white'
            shallow={true}
          >
            <HomeIcon />
            Home
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor
            href={['/player/browse', '/player/genre']}
            className='font-short-big font-weight-bold font-white'
          >
            <BrowseIcon />
            Browse
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor
            href={`/player/library/${authState.id}`}
            className='font-short-big font-weight-bold font-white'
          >
            <LibraryIcon />
            Library
          </NavLinkColor>
        </li>
      </ul>
      <div className='quick-menu'>
        <Link
          to={`/player/library/${authState.id}/artists`}
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Artist
        </Link>
        <Link
          to={`/player/library/${authState.id}/releases`}
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Releases
        </Link>
        <Link
          to={`/player/library/${authState.id}/tracks`}
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

export default NavMenu;
