import React from 'react';
import { getDatePart, getFormattedTime } from '../../../utils/Common';
import { NavLinkUnderline } from '../../links';
import CellAction from './TableCellAction';
import CellExtra from './TableCellExtra';
import CellFavorite from './TableCellFavorite';

function RowPlaylist({
  index = 0,
  item = {},
  playFromId = '',
  playlistRelation = []
}) {
  const {
    id = '',
    title = '',
    artists = [],
    release = {},
    duration = 0,
    addedAt = '',
    relation = []
  } = item;
  const { artist = {} } = release;

  return (
    <div className='table-row content'>
      <CellAction
        id={id}
        serial={index + 1}
        playFromId={playFromId}
        playFromType='playlist'
      />
      <CellFavorite id={id} index={index} relation={relation} />
      <div className='title'>
        <span className='ellipsis one-line'>{title}</span>
      </div>
      <CellExtra
        id={id}
        index={index}
        relation={relation}
        artistId={artist.id}
        releaseId={release.id}
        playlistId={playFromId}
        playlistRelation={playlistRelation}
        fromType='playlist'
      />
      <div className='artist'>
        <div className='ellipsis one-line'>
          {artists
            .map((artistTmp = {}) => (
              <NavLinkUnderline
                href={`/player/artist/${artistTmp.id}`}
                className='font-white'
                key={artistTmp.id}
              >
                {artistTmp.displayName}
              </NavLinkUnderline>
            ))
            .reduce((prev, curr) => [prev, ', ', curr])}
        </div>
      </div>
      <div className='release'>
        <span className='ellipsis one-line'>
          <NavLinkUnderline
            href={`/player/release/${release.id}`}
            className='font-white'
          >
            {release.title}
          </NavLinkUnderline>
        </span>
      </div>
      <div className='duration center side'>
        <span className='ellipsis one-line'>
          {getFormattedTime(duration / 1000)}
        </span>
      </div>
      <div className='added-date side'>
        <span className='ellipsis one-line'>{getDatePart(addedAt)}</span>
      </div>
    </div>
  );
}

export default RowPlaylist;
