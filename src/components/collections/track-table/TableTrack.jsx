import React from 'react';
import { DateIcon, TimerIcon } from '../../../assets/svgs';
import RowGeneral from './TableRowGeneral';
import RowPlaylist from './TableRowPlaylist';
import RowRelease from './TableRowRelease';

function TrackTable(props) {
  const { type } = props;
  const { items } = props;

  return (
    <div className='collection-table'>
      {/* Track table header */}
      <div className='collection-table__row collection-table__row--header'>
        <div className='collection-table__cell collection-table__cell--action'>
          <span>#</span>
        </div>
        <div className='collection-table__cell collection-table__cell--favorite'></div>
        <div className='collection-table__cell collection-table__cell--title'>
          <span>TITLE</span>
        </div>
        {type === 'search' || type === 'favorite' || type === 'playlist' ? (
          <React.Fragment>
            <div className='collection-table__cell collection-table__cell--artist'>
              <span>ARTISTS</span>
            </div>
            <div className='collection-table__cell collection-table__cell--release'>
              <span>RELEASE</span>
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
        <div className='collection-table__cell collection-table__cell--duration'>
          <span>
            <TimerIcon />
          </span>
        </div>
        {type === 'playlist' ? (
          <div className='collection-table__cell collection-table__cell--added-date'>
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
                  playFromId={item.release ? item.release.id : ''}
                />
              );
            }
          })
        : ''}
    </div>
  );
}

export default TrackTable;
