import React from 'react';
import { Link } from 'react-router-dom';

import { NavLinkUnderline } from '../links';
import { ButtonIcon } from '../buttons';

import Placeholder from '../../assets/imgs/placeholder.png';
import {
  PlayIcon,
  UnFavoriteIcon,
  MoreIcon,
  FavoriteIcon
} from '../../assets/svgs';

function CardMain(props) {
  const { content } = props;
  const { relation } = content;

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
        <div className='action'>
          <ButtonIcon>
            <PlayIcon />
          </ButtonIcon>
          <div className='action__extra'>
            {relation.includes('own') ? (
              ''
            ) : relation.includes('favorite') ? (
              <ButtonIcon>
                <FavoriteIcon className='svg--blue' />
              </ButtonIcon>
            ) : (
              <ButtonIcon>
                <UnFavoriteIcon />
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
        <div className='content font-short-s font-gray-light'>
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
