import React from 'react';
import { getFormattedTime } from '../../../utils/Common';
import { NavLinkUnderline } from '../../links';
import CellAction from './TableCellAction';
import CellFavorite from './TableCellFavorite';
import CellTitle from './TableCellTitle';

function RowGeneral(props) {
  const { item, serial } = props;

  const playFromType =
    props.playFromType === 'favorite' ? 'favorite' : 'release';

  return (
    <div className='collection-table__row collection-table__row--data'>
      <CellAction
        serial={serial + 1}
        id={item.id}
        playFromId={props.playFromId}
        playFromType={playFromType}
      />
      <CellFavorite
        id={item.id}
        index={serial}
        relation={item.relation}
        collectionKey='track'
      />
      <CellTitle
        id={item.id}
        title={item.title}
        fromType='release'
        releaseId={item.release.id}
        artistId={item.release.artist ? item.release.artist.id : ''}
        index={serial}
        relation={item.relation}
        collectionKey='track'
      />
      <div className='collection-table__cell collection-table__cell--artist'>
        <span className='main'>
          {item.artists
            ? item.artists
                .map(artist => (
                  <NavLinkUnderline
                    href={`/player/artist/${artist.id}`}
                    className='font-white'
                    key={artist.id}
                  >
                    {artist.displayName}
                  </NavLinkUnderline>
                ))
                .reduce((prev, curr) => [prev, ', ', curr])
            : ''}
        </span>
      </div>
      <div className='collection-table__cell collection-table__cell--release'>
        <span className='main'>
          <NavLinkUnderline
            href={`/player/release/${item.release ? item.release.id : ''}`}
            className='font-white'
          >
            {item.release ? item.release.title : ''}
          </NavLinkUnderline>
        </span>
      </div>
      <div className='collection-table__cell collection-table__cell--duration'>
        <span className='main'>{getFormattedTime(item.duration / 1000)}</span>
      </div>
    </div>
  );
}

export default RowGeneral;
