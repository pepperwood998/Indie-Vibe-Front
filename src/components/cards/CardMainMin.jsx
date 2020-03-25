import React, { useContext } from 'react';

import { addTrackToPlaylist } from '../../apis/API';
import { AuthContext, LibraryContext } from '../../contexts';

import Placeholder from '../../assets/imgs/placeholder.png';

function CardMainMin(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const handleChoosePlaylist = () => {
    addTrackToPlaylist(
      authState.token,
      content.id,
      libState.browsePlaylists.trackId
    )
      .then(res => {
        if (res.status === 'success') {
          libDispatch(
            libActions.setNotification(true, true, 'Track added to playlist')
          );
          libDispatch(libActions.setBrowsePlaylists(false, ''));
          libDispatch(libActions.addTrackToPlaylist(content.id));
        } else {
          throw 'Error';
        }
      })
      .catch(error => {
        libDispatch(
          libActions.setNotification(true, false, 'Track already in playlist')
        );
      });
  };
  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper'>
        <div className='dummy'></div>
        <img
          src={content.thumbnail ? content.thumbnail : Placeholder}
          className='cover'
          onClick={handleChoosePlaylist}
        />
      </div>
      <div className='card-main__info'>
        <div className='font-short-big font-weight-bold font-white'>
          {content.title}
        </div>
        <div className='content font-short-s font-gray-light'>{`${content.tracksCount} tracks`}</div>
      </div>
    </div>
  );
}

export default CardMainMin;
