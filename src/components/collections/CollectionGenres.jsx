import React from 'react';
import { genOneValueArr } from '../../utils/Common';
import { CardGenre } from '../cards';

function CollectionGenres({
  full = false,
  header = '',
  items = [],
  loading = false
}) {
  let headerClasses = 'collection-main__header';
  headerClasses += full ? ' full' : '';

  return (
    <div className='collection-main collection-main--genres'>
      <div className={headerClasses}>{header}</div>
      <div className='collection-main__content grid genres'>
        {loading
          ? genOneValueArr(4, true).map((value, index) => (
              <CardGenre loading key={index} />
            ))
          : items.map((item, index) => (
              <CardGenre content={item} key={index} />
            ))}
      </div>
    </div>
  );
}

export default CollectionGenres;
