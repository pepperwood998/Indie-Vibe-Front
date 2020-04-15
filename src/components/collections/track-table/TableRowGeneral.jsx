import React from 'react';
import { getFormattedTime } from '../../../utils/Common';
import { NavLinkUnderline } from '../../links';
import CellAction from './TableCellAction';
import CellExtra from './TableCellExtra';
import CellFavorite from './TableCellFavorite';

function RowGeneral(props) {
  const { item, serial } = props;

  const playFromType =
    props.playFromType === 'favorite' ? 'favorite' : 'release';

  return (
    <div className='table-row content'>
      <CellAction
        serial={serial + 1}
        id={item.id}
        playFromId={props.playFromId}
        playFromType={playFromType}
        inQueue={props.inQueue}
      />
      <CellFavorite
        id={item.id}
        index={serial}
        relation={item.relation}
        collectionKey='track'
      />
      <div className='title'>
        <span className='ellipsis one-line'>{item.title}</span>
      </div>
      <CellExtra
        id={item.id}
        fromType='release'
        releaseId={item.release.id}
        artistId={item.release.artist ? item.release.artist.id : ''}
        index={serial}
        relation={item.relation}
        collectionKey='track'
        inQueue={props.inQueue}
      />
      <div className='artist'>
        <span className='ellipsis one-line'>
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
      <div className='release'>
        <span className='ellipsis one-line'>
          <NavLinkUnderline
            href={`/player/release/${item.release ? item.release.id : ''}`}
            className='font-white'
          >
            {item.release ? item.release.title : ''}
          </NavLinkUnderline>
        </span>
      </div>
      <div className='duration center side'>
        <span className='ellipsis one-line'>
          {getFormattedTime(item.duration / 1000)}
        </span>
      </div>
    </div>
  );
}

export default RowGeneral;
