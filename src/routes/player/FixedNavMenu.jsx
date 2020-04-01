import React, { useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAccount } from '../../apis/API';
import { BrowseIcon, HomeIcon, LibraryIcon, Logo } from '../../assets/svgs';
import { ButtonFrame } from '../../components/buttons';
import { NavLinkColor } from '../../components/links';
import { AuthContext, LibraryContext, MeContext } from '../../contexts';

function NavMenu() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: meState,
    actions: meActions,
    dispatch: meDispatch
  } = useContext(MeContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  useEffect(() => {
    if (!meState.id) {
      getAccount(authState.token).then(json => {
        if (json.status === 'success') {
          meDispatch(meActions.loadMe(json.data));
        }
      });
    }
  });

  const handleToggleCtxMenu = e => {
    if (libState.ctxMenuOpened) return;

    const { x, y, width, height } = e.target.getBoundingClientRect();
    libDispatch(
      libActions.openCtxMenu({
        content: {
          type: 'account'
        },
        pos: [x, y + height + 10]
      })
    );
  };

  return (
    <div className='nav-menu'>
      <div className='banner'>
        <section className='logo-wrapper'>
          <NavLink to='/player'>
            <Logo className='logo' />
          </NavLink>
        </section>

        {authState.role === 'r-free' ? (
          <section className='upgrade'>
            <a href='/premium'>
              <ButtonFrame>UPGRADE</ButtonFrame>
            </a>
          </section>
        ) : (
          ''
        )}
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
