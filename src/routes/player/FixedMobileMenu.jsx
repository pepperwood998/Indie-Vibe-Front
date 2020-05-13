import React, { useContext } from 'react';
import { BrowseIcon, HomeIcon, LibraryIcon } from '../../assets/svgs';
import { NavLinkColor } from '../../components/links';
import { AuthContext } from '../../contexts';

function MobileMenu() {
  const { state: authState } = useContext(AuthContext);

  return (
    <div className='mobile-menu'>
      <ul className='h-100 d-flex flex-row justify-content-around align-items-center'>
        <li className='flex-1'>
          <MenuItem href={['/player', '/player/home']}>
            <HomeIcon className='svg--regular mb-1' />
            Home
          </MenuItem>
        </li>
        <li className='flex-1'>
          <MenuItem href={['/player/browse', '/player/genre']}>
            <BrowseIcon className='svg--regular mb-1' />
            Browse
          </MenuItem>
        </li>
        <li className='flex-1'>
          <MenuItem href={`/player/library/${authState.id}`}>
            <LibraryIcon className='svg--regular mb-1' />
            Library
          </MenuItem>
        </li>
      </ul>
    </div>
  );
}

function MenuItem({ href = '', children }) {
  return (
    <NavLinkColor
      href={href}
      className='font-short-s p-2 font-white d-flex flex-column justify-content-center align-items-center'
      shallow={true}
    >
      {children}
    </NavLinkColor>
  );
}

export default MobileMenu;
