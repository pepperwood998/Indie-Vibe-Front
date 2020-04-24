import React, { useContext, useEffect, useState } from 'react';
import { getTrackFull } from '../../apis/API';
import { CloseIcon } from '../../assets/svgs';
import { AuthContext, LibraryContext } from '../../contexts';

function GroupTrackCredits(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [track, setTrack] = useState({ artists: [], release: {} });

  useEffect(() => {
    getTrackFull(authState.token, libState.trackCredits.trackId).then(res => {
      if (res.status === 'success') {
        setTrack({ ...track, ...res.data });
      }
    });
  }, []);

  const handlePropagateDialog = e => {
    e.stopPropagation();
  };

  const handleCloseDialog = () => {
    libDispatch(libActions.setTrackCredits(false));
  };

  return (
    <div
      className='screen-overlay track-credits fadein'
      onClick={handleCloseDialog}
    >
      <div className='track-credits' onClick={handlePropagateDialog}>
        <div className='track-credits__header'>
          <span className='font-short-big font-weight-bold font-white'>
            Credits
          </span>
          <CloseIcon
            className='close svg--regular svg--cursor svg--scale'
            onClick={handleCloseDialog}
          />
        </div>
        <div className='track-credits__body'>
          <section>
            <span className='font-short-extra font-weight-bold font-white'>
              {track.title}
            </span>
          </section>
          <section>
            <ul>
              <li className='info'>
                <div className='font-short-big font-weight-bold font-white'>
                  Artist
                </div>
                <div className='font-short-regular font-gray-light'>
                  {track.artists.map(artist => artist.displayName).join(', ')}
                </div>
              </li>
              <li className='info'>
                <div className='font-short-big font-weight-bold font-white'>
                  Release
                </div>
                <div className='font-short-regular font-gray-light'>
                  {track.release.title}
                </div>
              </li>
              <li className='info'>
                <div className='font-short-big font-weight-bold font-white'>
                  Producer
                </div>
                <div className='font-short-regular font-gray-light'>
                  {track.producer}
                </div>
              </li>
            </ul>
          </section>
        </div>
        <div className='track-credits__footer'></div>
      </div>
    </div>
  );
}

export default GroupTrackCredits;
