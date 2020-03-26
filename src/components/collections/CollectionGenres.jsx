import React from 'react';
import { CardGenre } from '../cards';

function CollectionGenres(props) {
  let headerClasses = 'collection-main__header';
  headerClasses += props.full ? ' full' : '';

  return (
    <div className='collection-main collection-main--genres padder'>
      <div className={headerClasses}>{props.header}</div>
      <div className='collection-main__content grid genres'>
        {props.items.map((item, index) => (
          <CardGenre content={item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default CollectionGenres;
