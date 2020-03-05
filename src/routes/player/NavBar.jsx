import React from 'react';

import { NavLinkColor, NavLinkUnderline } from '../../components/links';

import { HomeIcon, BrowseIcon, LibraryIcon } from '../../assets/svgs';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';

function NavBar() {
  return (
    <div className='nav-menu'>
      <div className='user-box'>
        <div className='avatar-box'>
          <img src={AvatarPlaceholder} />
        </div>
        <span className='user-title'>
          <NavLinkUnderline
            href='/player/account'
            className='font-regular font-white'
          >
            Tuan Dao
          </NavLinkUnderline>
        </span>
      </div>
      <ul className='menu'>
        <li>
          <NavLinkColor href='/player/home' className='font-big font-white'>
            <HomeIcon />
            Home
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor href='/player/browse' className='font-big font-white'>
            <BrowseIcon />
            Browse
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor href='/player/library' className='font-big font-white'>
            <LibraryIcon />
            Library
          </NavLinkColor>
        </li>
      </ul>
      <div className='quick-menu'></div>
      <div className='artist-box'></div>
    </div>
  );
}

export default NavBar;
