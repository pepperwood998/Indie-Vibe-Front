import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { performActionFavorite } from '../../apis/API';
import { streamCollection } from '../../apis/StreamAPI';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import {
  FavoriteIcon,
  PauseIcon,
  PlayIcon,
  UnFavoriteIcon
} from '../../assets/svgs';
import { AuthContext, LibraryContext, StreamContext } from '../../contexts';
import { ButtonIcon, ButtonMore } from '../buttons';
import { NavLinkUnderline } from '../links';

function CardProfile(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const { content } = props;
  const type = content.role
    ? content.role.id === 'r-artist'
      ? 'artist'
      : 'profile'
    : '';
  let isCurrentList =
    content.type === streamState.playFromType &&
    content.id === streamState.playFromId;

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      type,
      content.id,
      content.relation,
      action
    )
      .then(r => {
        libDispatch(
          libActions.toggleFavorite({
            id: content.id,
            type,
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePlay = () => {
    if (isCurrentList) {
      streamDispatch(streamActions.togglePaused(false));
    } else {
      streamCollection(authState.token, content.type, content.id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(
            streamActions.start(res.data, content.type, content.id)
          );
        }
      });
    }
  };

  const handlePaused = () => {
    streamDispatch(streamActions.togglePaused(true));
  };

  let ctxClasses = 'action profile';
  if (
    isCurrentList ||
    (libState.ctxMenuOpened && content.id === libState.ctxMenuContent.id)
  )
    ctxClasses += ' active';
  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper profile'>
        <div className='dummy'></div>
        <img
          src={content.thumbnail ? content.thumbnail : AvatarPlaceholder}
          className='cover'
        />
        <div className={ctxClasses}>
          <Link
            className='action__link'
            to={
              type === 'artist'
                ? `/player/artist/${content.id}`
                : `/player/library/${content.id}`
            }
          ></Link>
          {type === 'artist' ? (
            <div className='action__play'>
              <ButtonIcon>
                {isCurrentList && !streamState.paused ? (
                  <PauseIcon onClick={handlePaused} />
                ) : (
                  <PlayIcon onClick={handlePlay} />
                )}
              </ButtonIcon>
            </div>
          ) : (
            ''
          )}
          <div className='action__extra profile'>
            {content.id !== authState.id ? (
              content.relation.includes('favorite') ? (
                <ButtonIcon>
                  <FavoriteIcon
                    className='svg--blue'
                    onClick={() => {
                      handleToggleFavorite('unfavorite');
                    }}
                  />
                </ButtonIcon>
              ) : (
                <ButtonIcon>
                  <UnFavoriteIcon
                    onClick={() => {
                      handleToggleFavorite('favorite');
                    }}
                  />
                </ButtonIcon>
              )
            ) : (
              ''
            )}
            <ButtonMore
              ctxData={{
                type,
                id: content.id,
                relation: content.relation,
                status: content.status
              }}
            />
          </div>
        </div>
      </div>
      <div className='card-main__info profile'>
        <NavLinkUnderline
          href={
            type === 'artist'
              ? `/player/artist/${content.id}`
              : `/player/library/${content.id}`
          }
          className='ellipsis one-line font-short-big font-weight-bold font-white'
        >
          {content.displayName}
        </NavLinkUnderline>
        <div className='bottom ellipsis one-line font-short-s font-gray-light'>
          {content.followersCount + ' followers'}
        </div>
      </div>
    </div>
  );
}

export default CardProfile;
