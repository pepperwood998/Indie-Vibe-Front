import React, { useContext } from 'react';

import { LinkWhiteColor } from '../links';
import { LibraryContext, AuthContext } from '../../contexts';
import { removeTrackFromPlaylist } from '../../apis/API';

function ContextTrack(props) {
  const { content, handlers } = props;

  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const playlistRelation = Array.isArray(content.playlistRelation)
    ? content.playlistRelation
    : [];

  const handleRemoveTrackFromPlaylist = () => {
    handlers.handleClose();
    removeTrackFromPlaylist(authState.token, content.playlistId, content.id)
      .then(res => {
        if (res.status === 'success') {
          libDispatch(
            libActions.removeTrackFromPlaylist(content.playlistId, content.id)
          );
          libDispatch(
            libActions.setNotification(
              true,
              true,
              'Track removed from playlist'
            )
          );
        } else {
          throw 'Error';
        }
      })
      .catch(error => {
        libDispatch(
          libActions.setNotification(
            true,
            false,
            'Failed to remove track from playlist'
          )
        );
      });
  };

  return (
    <div className='context-menu' ref={props.elemRef}>
      <ul>
        <li>
          <LinkWhiteColor>Add to queue</LinkWhiteColor>
        </li>
        <li
          onClick={() => {
            handlers.handleClose();
          }}
        >
          <LinkWhiteColor
            nav={true}
            href={`/player/artist/${content.artistId}`}
          >
            Discover Artist
          </LinkWhiteColor>
        </li>
        {content.fromType !== 'release' ? (
          <li
            onClick={() => {
              handlers.handleClose();
            }}
          >
            <LinkWhiteColor
              nav={true}
              href={`/player/release/${content.releaseId}`}
            >
              View Release
            </LinkWhiteColor>
          </li>
        ) : (
          ''
        )}
        <li>
          <LinkWhiteColor>Show credits</LinkWhiteColor>
        </li>
        {playlistRelation.includes('own') && content.fromType === 'playlist' ? (
          <li>
            <LinkWhiteColor onClick={handleRemoveTrackFromPlaylist}>
              Remove from playlist
            </LinkWhiteColor>
          </li>
        ) : (
          ''
        )}
        <li>
          <LinkWhiteColor
            onClick={() => {
              handlers.handleClose();
              libDispatch(libActions.setBrowsePlaylists(true, content.id));
            }}
          >
            Add to Playlist
          </LinkWhiteColor>
        </li>
        <li>
          {Array.isArray(content.relation) &&
          content.relation.includes('favorite') ? (
            <LinkWhiteColor
              onClick={() => {
                handlers.handleToggleFavorite('unfavorite');
              }}
            >
              Remove from Favorite
            </LinkWhiteColor>
          ) : (
            <LinkWhiteColor
              onClick={() => {
                handlers.handleToggleFavorite('favorite');
              }}
            >
              Add to Favorite
            </LinkWhiteColor>
          )}
        </li>
      </ul>
    </div>
  );
}

export default ContextTrack;
