import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getPlaylistsMeOwn } from '../../apis/API';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { AddPlaylistIcon, ArrowDown } from '../../assets/svgs';
import { ButtonLoadMore } from '../../components/buttons';
import { LinkWhiteColor } from '../../components/links';
import Tooltip from '../../components/tooltips/Tooltip';
import { AuthContext, LibraryContext, MeContext } from '../../contexts';

function QuickAccess(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: meState } = useContext(MeContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  useEffect(() => {
    getPlaylistsMeOwn(authState.token).then(res => {
      if (res.status === 'success' && res.data) {
        libDispatch(libActions.setMyPlaylists(res.data));
      }
    });
  }, []);

  let playlists = libState.myPlaylists;

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

  const handleOpenDialog = () => {
    libDispatch(libActions.setEditPlaylist(true));
  };

  const handleLoadMore = () => {
    getPlaylistsMeOwn(authState.token, playlists.offset + playlists.limit).then(
      res => {
        if (res.status === 'success' && res.data.items) {
          libDispatch(libActions.loadMorePlaylists(res.data));
        }
      }
    );
  };

  let userBoxClasses = 'user-box';
  if (libState.ctxMenuOpened && libState.ctxMenuContent.type === 'account') {
    userBoxClasses += ' active';
  }
  return (
    <div className='quick-access'>
      <div className='quick-access__account'>
        <div className={userBoxClasses}>
          <section className='title'>
            <NavLink to='/player/account'>
              <span className='font-short-regular font-weight-bold font-white ellipsis one-line'>
                {meState.displayName}
              </span>
            </NavLink>
          </section>
          <section onClick={handleToggleCtxMenu} className='d-flex'>
            <div className='thumbnail'>
              <div className='img-wrapper'>
                <img
                  className='img'
                  src={
                    meState.thumbnail ? meState.thumbnail : AvatarPlaceholder
                  }
                />
              </div>
            </div>
            <div>
              <ArrowDown className='svg--small' />
            </div>
          </section>
        </div>
      </div>
      <div className='quick-access__playlists'>
        <div className='banner'>
          <span className='font-short-s font-gray-light'>Playlists</span>
          <Tooltip tooltip='New playlist' pos='left'>
            <AddPlaylistIcon
              className='svg--regular svg--cursor svg--scale'
              onClick={handleOpenDialog}
            />
          </Tooltip>
        </div>
        <div className='content-wrapper'>
          <ul className='content'>
            {playlists.items.length > 0 ? (
              playlists.items.map((item, index) => (
                <li className='item-wrapper' key={index}>
                  <LinkWhiteColor
                    href={`/player/playlist/${item.id}`}
                    className='item font-short-regular font-weight-bold'
                    nav={true}
                  >
                    {item.title}
                  </LinkWhiteColor>
                </li>
              ))
            ) : (
              <div className='text-center'>
                <span
                  className='link link-underline font-tip font-gray-light'
                  onClick={handleOpenDialog}
                >
                  - Create a playlist -
                </span>
              </div>
            )}
          </ul>
          {playlists.total > playlists.offset + playlists.limit ? (
            <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickAccess;
