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
  const { state: libState } = useContext(LibraryContext);

  const [relation, setRelation] = useState([...content.relation]);

  useEffect(() => {
    props.extra.handleToggleFavorite(props.index, relation, content.type);
  }, [relation]);

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      content.type,
      content.id,
      relation,
      action
    )
      .then(r => {
        setRelation(r);
      })
      .catch(error => {
        console.error(error);
      });
  };

  let ctxClasses = 'action profile';
  if (libState.ctxMenuOpened && content.id === libState.ctxMenuContent.id)
    ctxClasses += ' ctx-menu';
  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper profile'>
        <div className='dummy'></div>
        <Link to={`/player/${content.type}/${content.id}`}>
          <img
            src={content.thumbnail ? content.thumbnail : AvatarPlaceholder}
            className='cover'
          />
        </Link>
        <div className={ctxClasses}>
          {content.type === 'artist' ? (
            <ButtonIcon>
              <PlayIcon />
            </ButtonIcon>
          ) : (
            ''
          )}
          <div className='action__extra profile'>
            {relation.includes('favorite') ? (
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
              handleToggleFavorite={handleToggleFavorite}
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
