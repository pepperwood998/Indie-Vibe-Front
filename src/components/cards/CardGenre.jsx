import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import Placeholder from '../../assets/imgs/placeholder.png';

function CardGenre({ content = {}, loading = false }) {
  return (
    <div className='card-simple'>
      {loading ? (
        <Skeleton width='100%' height='100%' />
      ) : (
        <NavLink
          to={`/player/genre/${content.id}`}
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
      )}
    </div>
  );
}

export default CardGenre;
