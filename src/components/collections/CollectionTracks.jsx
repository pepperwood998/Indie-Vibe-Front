import React from 'react';
import { TrackTable } from './track-table';
import Skeleton from 'react-loading-skeleton';

function CollectionTracks({
  header = '',
  items = [],
  type = '',
  playFromId = '',
  loading = false
}) {
  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{header || <Skeleton />}</div>
      <div className='collection-main__content'>
        {/* {items.slice(offset, limit).map((item, index) => '')} */}
        <TrackTable
          items={items}
          type={type}
          playFromId={playFromId}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default CollectionTracks;
