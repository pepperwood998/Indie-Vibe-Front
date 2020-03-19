import React from 'react';

import CollectionTrackTable from './CollectionTrackTable';

function CollectionTracks(props) {
  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{props.header}</div>
      <div className='collection-main__content'>
        {/* {items.slice(offset, limit).map((item, index) => '')} */}
        <CollectionTrackTable
          data={props.data}
          extra={props.extra}
          collectionId={props.collectionId}
        />
      </div>
    </div>
  );
}

export default CollectionTracks;
