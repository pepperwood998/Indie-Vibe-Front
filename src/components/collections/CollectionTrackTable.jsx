import React, { useEffect } from 'react';

function CollectionTrackTable(props) {
  let { items, offset, limit } = props.data;
  const { type } = props;

  useEffect(() => {
    if (props.short) {
      offset = 0;
      limit = 10;
    }
  }, []);

  return (
    <div className='collection-table'>
      <div className='collection-table__row collection-table__row--header'>
        <div className='collection-table__cell collection-table__cell--action'>
          #
        </div>
        <div className='collection-table__cell collection-table__cell--favorite'></div>
        <div className='collection-table__cell collection-table__cell--title'>
          TITLE
        </div>
        {type === 'playlist' ? (
          <React.Fragment>
            <div className='collection-table__cell collection-table__cell--artist'>
              ARTISTS
            </div>
            <div className='collection-table__cell collection-table__cell--release'>
              RELEASE
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
        <div className='collection-table__cell collection-table__cell--duration'>
          DURATION
        </div>
        {type === 'playlist' ? (
          <div className='collection-table__cell collection-table__cell--added-date'>
            DATE
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='collection-table__row'>
        <div className='collection-table__cell collection-table__cell--action'></div>
        <div className='collection-table__cell collection-table__cell--favorite'></div>
        <div className='collection-table__cell collection-table__cell--title'></div>
        {type === 'playlist' ? (
          <React.Fragment>
            <div className='collection-table__cell collection-table__cell--artist'></div>
            <div className='collection-table__cell collection-table__cell--release'></div>
          </React.Fragment>
        ) : (
          ''
        )}
        <div className='collection-table__cell collection-table__cell--duration'></div>
        {type === 'playlist' ? (
          <div className='collection-table__cell collection-table__cell--added-date'></div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default CollectionTrackTable;
