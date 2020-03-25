import React from 'react';

import CollectionTrackTable from './CollectionTrackTable';

function CollectionTracks(props) {
  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{props.header}</div>
      <div className='collection-main__content'>
        {/* {items.slice(offset, limit).map((item, index) => '')} */}
        <CollectionTrackTable
          items={props.items}
          type={props.type}
          playFromId={props.playFromId}
        />
      </div>
    </div>
  );
}

export default CollectionTracks;
