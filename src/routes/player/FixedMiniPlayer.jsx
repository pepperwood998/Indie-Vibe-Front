import React, { useContext } from 'react';
import { performActionFavorite } from '../../apis/API';
import Placeholder from '../../assets/imgs/placeholder.png';
import {
  FavoriteIcon,
  PauseSmallIcon,
  PlayIcon,
  PlaySmallIcon,
  UnFavoriteIcon
} from '../../assets/svgs';
import { AuthContext, LibraryContext, StreamContext } from '../../contexts';

function MiniPlayer() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const { id = '', title = '', release = {}, relation = [] } = streamState.info;

  const handleToggleFavorite = action => {
    performActionFavorite(authState.token, 'track', id, relation, action)
      .then(r => {
        streamDispatch(streamActions.setTrackFavorite(id, r));
        libDispatch(
          libActions.toggleFavorite({
            id,
            type: 'track',
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (!id) return '';

  return (
    <div className='mini-player'>
      <div className='d-flex flex-row align-items-center justify-content-around h-100'>
        <section className='cover-container'>
          <div className='img-wrapper'>
            <img
              className='img'
              src={release.thumbnail ? release.thumbnail : Placeholder}
            />
          </div>
        </section>
        <section className='title-container flex-1 h-100 d-flex align-items-center'>
          <div className='side-blur'></div>
          <span className='font-short-regular font-weight-bold font-white ellipsis one-line'>
            Neu ngay mai khong den
          </span>
        </section>
        <section className='action-container d-flex flex-row align-items-center justify-content-around'>
          {relation.includes('favorite') ? (
            <FavoriteIcon
              onClick={() => {
                handleToggleFavorite('unfavorite');
              }}
            />
          ) : (
            <UnFavoriteIcon
              onClick={() => {
                handleToggleFavorite('favorite');
              }}
            />
          )}
          {streamState.loading ? (
            <div className='play-loading'>
              <div className='loader loader-1'>
                <span></span>
              </div>
              <PlayIcon className='icon svg--small svg--disabled' />
            </div>
          ) : streamState.paused ? (
            <PlaySmallIcon
              onClick={() => {
                streamDispatch(streamActions.togglePaused());
              }}
            />
          ) : (
            <PauseSmallIcon
              onClick={() => {
                streamDispatch(streamActions.togglePaused());
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default MiniPlayer;
