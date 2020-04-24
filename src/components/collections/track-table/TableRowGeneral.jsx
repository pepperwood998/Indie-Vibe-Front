import React from 'react';
import { getFormattedTime } from '../../../utils/Common';
import { NavLinkUnderline } from '../../links';
import CellAction from './TableCellAction';
import CellExtra from './TableCellExtra';
import CellFavorite from './TableCellFavorite';

function RowGeneral({
  index = 0,
  item = {},
  playFromId = '',
  playFromType = '',
  inQueue
}) {
  playFromType = playFromType === 'favorite' ? 'favorite' : 'release';
  const {
    id = '',
    title = '',
    artists = [],
    release = {},
    duration,
    relation
  } = item;
  const { artist = {} } = release;

  return (
    <div className='table-row content'>
      <CellAction
        id={id}
        serial={index + 1}
        playFromId={playFromId}
        playFromType={playFromType}
        inQueue={inQueue}
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
        fromType='release'
        inQueue={inQueue}
      />
      <div className='artist'>
        <span className='ellipsis one-line'>
          {artists
            .map(artistTmp => (
              <NavLinkUnderline
                href={`/player/artist/${artistTmp.id}`}
                className='font-white'
                key={artistTmp.id}
              >
                {artistTmp.displayName}
              </NavLinkUnderline>
            ))
            .reduce((prev, curr) => (!prev ? [curr] : [prev, ', ', curr]), '')}
        </span>
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
      <div className='duration center'>
        <span className='ellipsis one-line'>
          {getFormattedTime(duration / 1000)}
        </span>
      </div>
    </div>
  );
}

export default RowGeneral;
