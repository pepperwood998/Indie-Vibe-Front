import React from 'react';
import { getFormattedTime } from '../../../utils/Common';
import CellAction from './TableCellAction';
import CellFavorite from './TableCellFavorite';
import CellExtra from './TableCellExtra';

function RowRelease(props) {
  const { item, serial } = props;

  return (
    <div className='table-row content'>
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
      <div className='title'>
        <span className='ellipsis one-line'>{item.title}</span>
      </div>
      <CellExtra
        id={item.id}
        fromType='release'
        artistId={props.artistId}
        index={serial}
        relation={item.relation}
        collectionKey='release'
      />
      <div className='duration center side'>
        <span className='ellipsis one-line'>
          {getFormattedTime(item.duration / 1000)}
        </span>
      </div>
    </div>
  );
}

export default RowRelease;
