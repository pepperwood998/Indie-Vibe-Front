import React from 'react';
import { CardRelease } from '../cards';
import Skeleton from 'react-loading-skeleton';
import { genOneValueArr } from '../../utils/Common';

function CollectionWide({
  full = false,
  header = '',
  items = [],
  loading = false
}) {
  let headerClasses = 'collection-main__header';
  headerClasses += full ? ' full' : '';

  return (
    <div className='collection-main collection-main--wide padder'>
      <div className={headerClasses}>{loading ? <Skeleton /> : header}</div>
      <div className='collection-main__content grid wide'>
        {loading
          ? genOneValueArr(3, true).map((value, index) => (
              <CardRelease loading key={index} />
            ))
          : items.map((item, index) => (
              <CardRelease content={item} key={index} />
            ))}
      </div>
    </div>
  );
}

export default CollectionWide;
