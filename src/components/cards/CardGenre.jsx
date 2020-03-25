import React from 'react';
import { NavLink } from 'react-router-dom';
import Placeholder from '../../assets/imgs/placeholder.png';

function CardGenre(props) {
  const { content } = props;

  return (
    <div className='card-simple'>
      <NavLink
        to={`/player/browse/genre/${content.id}`}
        className='link font-short-extra font-weight-bold font-white'
      >
        <div className='background'>
          <img
            className='background__img'
            src={content.thumbnail ? content.thumbnail : Placeholder}
          />
          <div className='background__layer'></div>
        </div>
        <div className='title'>{content.name}</div>
      </NavLink>
    </div>
  );
}

export default CardGenre;
