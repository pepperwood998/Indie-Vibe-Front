import React from 'react';
import { DateIcon, TimerIcon } from '../../../assets/svgs';
import RowGeneral from './TableRowGeneral';
import RowPlaylist from './TableRowPlaylist';
import RowRelease from './TableRowRelease';

function TrackTable(props) {
  const { type, items } = props;

  return (
    <div className='collection-table table-layout table-layout--collapse'>
      {/* Track table header */}
      <div className='table-row header'>
        <div className='action center'>
          <span>#</span>
        </div>
        <div className='favorite'></div>
        <div className='title'>
          <span>TITLE</span>
        </div>
        <div className='extra'></div>
        {type === 'search' ||
        type === 'favorite' ||
        type === 'playlist' ||
        type === 'queue' ? (
          <React.Fragment>
            <div className='artist'>
              <span>ARTISTS</span>
            </div>
            <div className='release'>
              <span>RELEASE</span>
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
        <div className='duration center'>
          <span>
            <TimerIcon />
          </span>
        </div>
        {type === 'playlist' ? (
          <div className='added-date side'>
            <span>
              <DateIcon />
            </span>
          </div>
        ) : (
          ''
        )}
      </div>

      {/* Track table content */}
      {items
        ? items.map((item, index) => {
            if (type === 'playlist') {
              item = Object.assign(
                {},
                {
                  addedAt: item.addedAt,
                  ...item.track
                }
              );
              return (
                <RowPlaylist
                  item={item}
                  key={index}
                  serial={index}
                  playFromId={props.playFromId}
                  playlistRelation={props.playlistRelation}
                />
              );
            } else if (type === 'release') {
              return (
                <RowRelease
                  item={item}
                  key={index}
                  serial={index}
                  artistId={props.releaseArtistId}
                  playFromId={props.playFromId}
                />
              );
            } else {
              return (
                <RowGeneral
                  item={item}
                  key={index}
                  serial={index}
                  playFromType={type}
                  playFromId={
                    props.playFromId
                      ? props.playFromId
                      : item.release
                      ? item.release.id
                      : ''
                  }
                  inQueue={props.inQueue}
                />
              );
            }
          })
        : ''}
    </div>
  );
}

export default TrackTable;
