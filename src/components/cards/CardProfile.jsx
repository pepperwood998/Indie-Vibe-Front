import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ButtonIcon, ButtonMore } from '../buttons';
import { NavLinkUnderline } from '../links';
import { AuthContext, LibraryContext } from '../../contexts';
import { performActionFavorite } from '../../apis/API';

import { FavoriteIcon, PlayIcon, UnFavoriteIcon } from '../../assets/svgs';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';

function CardProfile(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      content.type,
      content.id,
      content.relation,
      action
    )
      .then(r => {
        libDispatch(
          libActions.toggleFavorite({
            id: content.id,
            type: content.type,
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  let ctxClasses = 'action profile';
  if (libState.ctxMenuOpened && content.id === libState.ctxMenuContent.id)
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
            to={`/player/${content.type}/${content.id}`}
          ></Link>
          {content.type === 'artist' ? (
            <div className='action__play'>
              <ButtonIcon>
                <PlayIcon />
              </ButtonIcon>
            </div>
          ) : (
            ''
          )}
          <div className='action__extra profile'>
            {content.relation.includes('favorite') ? (
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
            )}
            <ButtonMore
              ctxData={{
                type: content.type,
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
          href={`/player/${content.type}/${content.id}`}
          className='font-short-big font-weight-bold font-white'
        >
          {content.displayName}
        </NavLinkUnderline>
        <div className='content profile font-short-s font-gray-light'>
          {content.type === 'artist'
            ? content.followersCount + ' followers'
            : ''}
        </div>
      </div>
    </div>
  );
}

export default CardProfile;
