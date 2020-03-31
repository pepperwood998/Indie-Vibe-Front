import React, { useContext, useEffect } from 'react';
import { getProfile, getAccount } from '../../../apis/API';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ArrowDown, Logo } from '../../../assets/svgs';
import { ButtonFrame } from '../../../components/buttons';
import { ContextMenuAccount } from '../../../components/context-menu';
import { LinkWhiteColor } from '../../../components/links';
import { AuthContext, MeContext } from '../../../contexts';

function NavBar(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);

  useEffect(() => {
    if (authState.token && !meState.id) {
      getAccount(authState.token).then(json => {
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
                active={props.active === 'home'}
              >
                Home
              </LinkWhiteColor>
            </li>
            <li className='nav-menu__item'>
              <LinkWhiteColor
                href='/premium'
                className='font-short-regular font-weight-bold font-white'
                active={props.active === 'premium'}
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
              <div className='context-wrapper'>
                <ContextMenuAccount fromLanding={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
