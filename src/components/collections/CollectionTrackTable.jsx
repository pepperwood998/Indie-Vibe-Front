import React, { useState, useContext, useEffect } from 'react';

import { NavLinkUnderline } from '../links';
import { getFormattedTime, getDatePart } from '../../utils/Common';
import { AuthContext, StreamContext, LibraryContext } from '../../contexts';
import { performActionFavorite } from '../../apis/API';
import { ButtonIcon } from '../buttons';
import { streamCollection } from '../../apis/StreamAPI';

import {
  UnFavoriteIcon,
  TimerIcon,
  DateIcon,
  FavoriteIcon,
  PlayIcon,
  PauseIcon,
  MoreIcon,
  PlusIcon
} from '../../assets/svgs';

function CollectionTrackTable(props) {
  const { type } = props;
  let { items } = props.data;

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
                <RowSearch
                  item={item}
                  key={index}
                  serial={index}
                  playFromType={type}
                  playFromId={item.release ? item.release.id : ''}
                />
              );
            }
          })
        : 'jkdfjekjw'}
    </div>
  );
}

function RowPlaylist(props) {
  const { item, serial } = props;

  return (
    <div className='collection-table__row collection-table__row--data'>
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
      <CellTitle
        id={item.id}
        title={item.title}
        fromType='playlist'
        releaseId={item.release.id}
        artistId={item.release.artist.id}
        index={serial}
        relation={item.relation}
        playlistId={props.playFromId}
        playlistRelation={props.playlistRelation}
        collectionKey='playlist'
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
      <div className='collection-table__cell collection-table__cell--added-date'>
        <span className='main'>{getDatePart(item.addedAt)}</span>
      </div>
    </div>
  );
}

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

function RowSearch(props) {
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
        artistId={item.release.artist.id}
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

function CellAction(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const current = streamState.queue[streamState.currentSongIndex];
  const { serial, id, playFromId, playFromType } = props;

  const handlePause = () => {
    streamDispatch(streamAction.togglePaused(true));
  };
  const handlePlay = () => {
    if (id === current && playFromId === streamState.playFromId) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      if (playFromId === streamState.playFromId) {
        streamDispatch(streamAction.reorder(id));
      } else {
        streamCollection(authState.token, playFromType, playFromId)
          .then(res => {
            if (res.status === 'success' && res.data.length) {
              streamDispatch(
                streamAction.start(res.data, playFromType, playFromId, id)
              );
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  };

  let classesAction = 'action';
  if (id === current && playFromId === streamState.playFromId) {
    classesAction += ' active';
  }
  return (
    <div className='collection-table__cell collection-table__cell--action'>
      <span>{serial}</span>
      <div className={classesAction}>
        <ButtonIcon>
          {id === current && !streamState.paused ? (
            <PauseIcon onClick={handlePause} />
          ) : (
            <PlayIcon onClick={handlePlay} />
          )}
        </ButtonIcon>
      </div>
    </div>
  );
}

function CellFavorite(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      'track',
      props.id,
      props.relation,
      action
    )
      .then(r => {
        streamDispatch(streamActions.setTrackFavorite(props.id, r));
        libDispatch(
          libActions.toggleFavorite({
            id: props.id,
            type: 'track',
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='collection-table__cell collection-table__cell--favorite'>
      {props.relation.includes('favorite') ? (
        <FavoriteIcon
          className='svg--cursor svg--scale svg--blue'
          onClick={() => {
            handleToggleFavorite('unfavorite');
          }}
        />
      ) : (
        <UnFavoriteIcon
          className='svg--cursor svg--scale'
          onClick={() => {
            handleToggleFavorite('favorite');
          }}
        />
      )}
    </div>
  );
}

function CellTitle(props) {
  const { title } = props;

  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const handleToggleCtxMenu = e => {
    if (libState.ctxMenuOpened) return;

    const { x, y, width, height } = e.target.getBoundingClientRect();
    libDispatch(
      libActions.openCtxMenu({
        content: {
          type: 'track',
          id: props.id,
          fromType: props.fromType,
          relation: props.relation,
          releaseId: props.releaseId,
          artistId: props.artistId,
          playlistId: props.playlistId,
          playlistRelation: props.playlistRelation
        },
        pos: [x, y + height + 10]
      })
    );
  };

  const handleBrowsePlaylists = () => {
    libDispatch(libActions.closeCtxMenu());
    libDispatch(libActions.setBrowsePlaylists(true, props.id));
  };

  return (
    <div className='collection-table__cell collection-table__cell--title'>
      <span className='main'>{title}</span>
      <span className='extra'>
        <PlusIcon
          className='svg--cursor svg--gray-light svg--bright'
          onClick={handleBrowsePlaylists}
        />
        <MoreIcon
          className='svg--cursor svg--gray-light svg--bright'
          onClick={handleToggleCtxMenu}
        />
      </span>
    </div>
  );
}

export default CollectionTrackTable;
