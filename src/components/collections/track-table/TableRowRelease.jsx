import React from 'react';
import { getFormattedTime } from '../../../utils/Common';
import CellAction from './TableCellAction';
import CellFavorite from './TableCellFavorite';
import CellTitle from './TableCellTitle';

function RowRelease(props) {
  const { item, serial } = props;

  return (
    <div className='collection-table__row collection-table__row--data'>
      <CellAction
        serial={serial + 1}
        id={item.id}
        playFromId={props.playFromId}
        playFromType='release'
      />
      <CellFavorite
        id={item.id}
        index={serial}
        relation={item.relation}
        collectionKey='release'
      />
      <CellTitle
        id={item.id}
        title={item.title}
        fromType='release'
        artistId={props.artistId}
        index={serial}
        relation={item.relation}
        collectionKey='release'
      />
      <div className='collection-table__cell collection-table__cell--duration'>
        <span className='main'>{getFormattedTime(item.duration / 1000)}</span>
      </div>
    </div>
  );
}

export default RowRelease;
