import React from 'react';
import Placeholder from '../../assets/imgs/placeholder.png';
import { NavLinkUnderline } from '../links';

function CardRelease(props) {
  const { content } = props;

  return (
    <div className='card-wide'>
      <div className='card-wide__info'>
        <div>
          <NavLinkUnderline
            href={`/player/release/${content.id}`}
            className='font-short-big font-weight-bold font-white'
          >
            {content.title}
          </NavLinkUnderline>
        </div>
        <div>
          <NavLinkUnderline
            href={`/player/artist/${content.artist.id}`}
            className='font-short-s font-white'
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
        <div className='layer'></div>
      </div>
    </div>
  );
}

export default CardRelease;
