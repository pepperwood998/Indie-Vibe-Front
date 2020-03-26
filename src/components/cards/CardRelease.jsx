import React from 'react';
import { NavLink } from 'react-router-dom';
import Placeholder from '../../assets/imgs/placeholder.png';
import { NavLinkUnderline } from '../links';

function CardRelease(props) {
  const { content } = props;

  return (
    <div className='card-wide'>
      <div className='card-wide__info'>
        <div className='title'>
          <NavLinkUnderline
            href={`/player/release/${content.id}`}
            className='ellipsis one-line font-short-big font-weight-bold font-white'
          >
            {content.title}
          </NavLinkUnderline>
        </div>
        <div className='description'>
          <NavLinkUnderline
            href={`/player/artist/${content.artist.id}`}
            className='ellipsis one-line font-short-s font-white'
          >
            {content.artist.displayName}
          </NavLinkUnderline>
        </div>
      </div>
      <div className='card-wide__thumbnail'>
        <div className='dummy'></div>
        <img
          className='thumbnail'
          src={content.thumbnail ? content.thumbnail : Placeholder}
        />
      </div>
      <div className='card-wide__bg'>
        <NavLink to={`/player/release/${content.id}`}>
          <div className='layer'></div>
        </NavLink>
      </div>
    </div>
  );
}

export default CardRelease;
