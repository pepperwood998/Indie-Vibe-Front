import React, { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ArrowDown, Logo } from '../../../assets/svgs';
import { ButtonFrame } from '../../../components/buttons';
import { ContextMenuAccount } from '../../../components/context-menu';
import { LinkWhiteColor } from '../../../components/links';
import { AuthContext, MeContext } from '../../../contexts';

function NavBar(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: meState } = useContext(MeContext);

  return (
    <Navbar bg='light' expand='lg' className='ivb-navbar'>
      <Navbar.Brand href='/home'>
        <Logo />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' className='toggle' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <Nav.Item>
            <LinkWhiteColor
              href='/home'
              className='font-short-regular font-weight-bold font-white item'
              active={props.active === 'home'}
            >
              Home
            </LinkWhiteColor>
          </Nav.Item>
          <Nav.Item>
            <LinkWhiteColor
              href='/premium'
              className='font-short-regular font-weight-bold font-white item'
              active={props.active === 'premium'}
            >
              Premium
            </LinkWhiteColor>
          </Nav.Item>
          <Nav.Item>
            <LinkWhiteColor
              href='/about'
              className='font-short-regular font-weight-bold font-white item'
              active={props.active === 'about'}
            >
              About
            </LinkWhiteColor>
          </Nav.Item>
        </Nav>
        {!authState.token ? (
          <React.Fragment>
            <a href='/register'>
              <ButtonFrame>Register</ButtonFrame>
            </a>
            <div className='nav-menu__item'>
              <LinkWhiteColor
                href='/login'
                className='font-short-regular font-weight-bold font-white item'
              >
                Sign in
              </LinkWhiteColor>
            </div>
          </React.Fragment>
        ) : (
          <div className='dropdown user-box-wrapper'>
            <div className='user-box' data-toggle='dropdown'>
              <div className='thumbnail-wrapper'>
                <div className='img-wrapper'>
                  <img
                    className='img'
                    src={
                      meState.thumbnail ? meState.thumbnail : AvatarPlaceholder
                    }
                  />
                </div>
              </div>
              <span className='ellipsis one-line font-short-regular font-weight-bold font-white pl-2'>
                {meState.displayName}
              </span>
              <ArrowDown />
            </div>
            <div className='dropdown-menu'>
              <div className='context-wrapper'>
                <ContextMenuAccount fromLanding={true} />
              </div>
            </div>
          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
