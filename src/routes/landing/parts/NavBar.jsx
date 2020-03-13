import React, { useContext, useEffect } from 'react';

import { LinkWhiteColor } from '../../../components/links';
import { ButtonFrame } from '../../../components/buttons';
import { ContextMenuAccount } from '../../../components/context-menu';
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
              <LinkWhiteColor
                href='/home'
                className='font-short-regular font-weight-bold font-white'
              >
                Home
              </LinkWhiteColor>
            </li>
            <li className='nav-menu__item'>
              <LinkWhiteColor
                href='#'
                className='font-short-regular font-weight-bold font-white'
              >
                Premium
              </LinkWhiteColor>
            </li>
            <li className='nav-menu__item'>
              <LinkWhiteColor
                href='#'
                className='font-short-regular font-weight-bold font-white'
              >
                About
              </LinkWhiteColor>
            </li>
          </ul>
        </nav>
      </div>
      <div className='nav-right'>
        {!authState.token ? (
          <React.Fragment>
            <a href='/register'>
              <ButtonFrame isFitted={true}>Register</ButtonFrame>
            </a>
            <div className='nav-menu__item'>
              <LinkWhiteColor
                href='/login'
                className='font-short-regular font-weight-bold font-white'
              >
                Sign in
              </LinkWhiteColor>
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
              <ContextMenuAccount fromLanding={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
