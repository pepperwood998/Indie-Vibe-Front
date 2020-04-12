import React from 'react';
import { getDatePart, getFormattedTime } from '../../../utils/Common';
import { NavLinkUnderline } from '../../links';
import CellAction from './TableCellAction';
import CellFavorite from './TableCellFavorite';
import CellExtra from './TableCellExtra';

function RowPlaylist(props) {
  const { item, serial } = props;

  return (
    <div className='table-row content'>
      <CellAction
        serial={serial + 1}
        id={item.id}
        playFromId={props.playFromId}
        playFromType='playlist'
      />
      <CellFavorite
        id={item.id}
        index={serial}
        relation={item.relation}
        collectionKey='playlist'
      />
      <div className='title'>
        <span className='ellipsis one-line'>{item.title}</span>
      </div>
      <CellExtra
        id={item.id}
        fromType='playlist'
        releaseId={item.release.id}
        artistId={item.release.artist ? item.release.artist.id : ''}
        index={serial}
        relation={item.relation}
        playlistId={props.playFromId}
        playlistRelation={props.playlistRelation}
        collectionKey='playlist'
      />
      <div className='artist'>
        <div className='ellipsis one-line'>
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
        </div>
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
        <span className='ellipsis one-line'>{getFormattedTime(item.duration / 1000)}</span>
      </div>
      <div className='added-date side'>
        <span className='ellipsis one-line'>{getDatePart(item.addedAt)}</span>
      </div>
    </div>
  );
}

export default RowPlaylist;
