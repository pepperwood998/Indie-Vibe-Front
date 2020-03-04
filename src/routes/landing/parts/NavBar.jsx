import React from 'react';

import { LinkColor } from '../../../components/links';
import { ButtonFrame } from '../../../components/buttons';

import { Logo, ArrowDown } from '../../../assets/svgs';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';

function NavBar(props) {
  return (
    <div className='content'>
      <div className='nav-left'>
        <div className='nav-left__logo'>
          <a href='/home'>
            <Logo />
          </a>
        </div>
        <nav className='nav-left__menu-container'>
          <ul className='nav-left__menu'>
            <li className='nav-menu__item'>
              <LinkColor label='Home' href='/home' />
            </li>
            <li className='nav-menu__item'>
              <LinkColor label='Premium' href='#' />
            </li>
            <li className='nav-menu__item'>
              <LinkColor label='About' href='#' />
            </li>
          </ul>
        </nav>
      </div>
      <div className='nav-right'>
        {!props.loggedIn ? (
          <React.Fragment>
            <a href='/register'>
              <ButtonFrame label='Register' />
            </a>
            <div className='nav-menu__item'>
              <LinkColor label='Sign in' href='/login' />
            </div>
          </React.Fragment>
        ) : (
          <div className='dropdown'>
            <div className='user-box' data-toggle='dropdown'>
              <img src={AvatarPlaceholder} width='50px' height='50px' />
              <ArrowDown />
            </div>
            <div className='dropdown-menu dropdown-menu-right'>
              <a className='dropdown-item' href='#'>
                Link 1
              </a>
              <a className='dropdown-item' href='#'>
                Link 2
              </a>
              <a className='dropdown-item' href='#'>
                Link 3
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
