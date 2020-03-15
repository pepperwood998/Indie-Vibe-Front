import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ButtonIcon } from '../buttons';
import { NavLinkUnderline } from '../links';
import { AuthContext } from '../../contexts';
import { performActionObject } from '../../apis/API';

import {
  FavoriteIcon,
  PlayIcon,
  UnFavoriteIcon,
  MoreIcon
} from '../../assets/svgs';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';

function CardProfile(props) {
  const { state: authState } = useContext(AuthContext);
  const { content } = props;

  const [relation, setRelation] = useState([...content.relation]);

  // useEffect(() => {
  //   props.handleToggleFavorite(content.type, props.index, relation);
  // }, [relation]);

  const handleToggleFavorite = action => {
    performActionObject(
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
        <div className='action profile'>
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
            <ButtonIcon>
              <MoreIcon />
            </ButtonIcon>
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
