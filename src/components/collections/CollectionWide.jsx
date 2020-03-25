import React from 'react';
import { CardRelease } from '../cards';

function CollectionWide(props) {
  let headerClasses = 'collection-main__header';
  headerClasses += props.full ? ' full' : '';

  return (
    <div className='collection-main collection-main--wide'>
      <div className={headerClasses}>{props.header}</div>
      <div className='collection-main__content grid wide'>
        {props.items.map((item, index) => (
          <CardRelease content={item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default CollectionWide;
