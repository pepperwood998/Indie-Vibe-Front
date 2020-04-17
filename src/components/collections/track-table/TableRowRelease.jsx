import React from 'react';
import { getFormattedTime } from '../../../utils/Common';
import CellAction from './TableCellAction';
import CellExtra from './TableCellExtra';
import CellFavorite from './TableCellFavorite';

function RowRelease({ index = 0, item = {}, playFromId = '', artistId = '' }) {
  const { id = '', title = '', duration = 0, relation = [] } = item;

  return (
    <div className='table-row content'>
      <CellAction
        id={id}
        serial={index + 1}
        playFromId={playFromId}
        playFromType='release'
      />
      <CellFavorite id={id} index={index} relation={relation} />
      <div className='title'>
        <span className='ellipsis one-line'>{title}</span>
      </div>
      <CellExtra
        id={id}
        index={index}
        artistId={artistId}
        relation={relation}
        fromType='release'
      />
      <div className='duration center'>
        <span className='ellipsis one-line'>
          {getFormattedTime(duration / 1000)}
        </span>
      </div>
    </div>
  );
}

export default RowRelease;
