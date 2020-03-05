import React, { useContext, useEffect } from 'react';

import { LinkColor } from '../../../components/links';
import { ButtonFrame } from '../../../components/buttons';
import { AccountContextMenu } from '../../../components/content-menu';
import { getMeSimple } from '../../../apis';
import { MeContext, AuthContext } from '../../../contexts';

import { Logo, ArrowDown } from '../../../assets/svgs';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';

function NavBar(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);

  useEffect(() => {
    if (authState.token && !meState.id) {
      getMeSimple(authState.token)
        .then(response => response.json())
        .then(json => {
          if (json.status === 'success') {
            meDispatch(meActions.loadMe(json.data));
          }
        });
    } else if (!authState.token && meState.id) {
      meDispatch(meActions.unloadMe());
    }
  });

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
              <LinkColor href='/home' className='font-regular font-white'>
                Home
              </LinkColor>
            </li>
            <li className='nav-menu__item'>
              <LinkColor href='#' className='font-regular font-white'>
                Premium
              </LinkColor>
            </li>
            <li className='nav-menu__item'>
              <LinkColor href='#' className='font-regular font-white'>
                About
              </LinkColor>
            </li>
          </ul>
        </nav>
      </div>
      <div className='nav-right'>
        {!authState.token ? (
          <React.Fragment>
            <a href='/register'>
              <ButtonFrame label='Register' />
            </a>
            <div className='nav-menu__item'>
              <LinkColor href='/login' className='font-regular font-white'>
                Sign in
              </LinkColor>
            </div>
          </React.Fragment>
        ) : (
          <div className='dropdown'>
            <div className='user-box' data-toggle='dropdown'>
              <img
                src={meState.thumbnail ? meState.thumbnail : AvatarPlaceholder}
                width='50px'
                height='50px'
              />
              <ArrowDown />
            </div>
            <div className='dropdown-menu dropdown-menu--fixed dropdown-menu-right'>
              <AccountContextMenu />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
