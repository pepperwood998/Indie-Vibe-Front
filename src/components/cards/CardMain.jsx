import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { NavLinkUnderline } from '../links';
import { ButtonIcon } from '../buttons';
import { performActionObject } from '../../apis/API';
import { AuthContext } from '../../contexts';

import Placeholder from '../../assets/imgs/placeholder.png';
import {
  PlayIcon,
  UnFavoriteIcon,
  MoreIcon,
  FavoriteIcon
} from '../../assets/svgs';

function CardMain(props) {
  const { state: authState } = useContext(AuthContext);
  const { content } = props;

  const [relation, setRelation] = useState([]);

  useEffect(() => {
    props.handleToggleFavorite(props.index, relation);
  }, [relation]);

  const handleToggleFavorite = action => {
    performActionObject(authState.token, content.type, content.id, action).then(
      res => {
        if (res.status === 'success') {
          if (action === 'favorite')
            setRelation([...content.relation, 'favorite']);
          else
            setRelation(content.relation.filter(value => value !== 'favorite'));
        }
      }
    );
  };

  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper'>
        <div className='dummy'></div>
        <Link to={`/player/${content.type}/${content.id}`}>
          <img
            src={content.thumbnail ? content.thumbnail : Placeholder}
            className='cover'
          />
        </Link>
        <div className='action playlist-release'>
          <ButtonIcon>
            <PlayIcon />
          </ButtonIcon>
          <div className='action__extra playlist-release'>
            {content.relation.includes('own') ? (
              ''
            ) : content.relation.includes('favorite') ? (
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
      <div className='card-main__info'>
        <NavLinkUnderline
          href={`/player/${content.type}/${content.id}`}
          className='font-short-big font-weight-bold font-white'
        >
          {content.title}
        </NavLinkUnderline>
        <div className='content playlist-release font-short-s font-gray-light'>
          <span>
            {content.type === 'release' ? (
              <React.Fragment>
                by&nbsp
                <NavLinkUnderline
                  href={`/player/artist/${content.artist.id}`}
                  className='font-gray-light'
                >
                  {content.artist.displayName}
                </NavLinkUnderline>
              </React.Fragment>
            ) : (
              content.description
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardMain;
