import React, { useContext, useEffect, useRef, useState } from 'react';
import { actionRequest, getPendingRelease } from '../../../apis/APICms';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { ButtonLoadMore } from '../../../components/buttons';
import { AuthContext, LibraryContext } from '../../../contexts';
import { getDatePart, getFormattedTime } from '../../../utils/Common';
import { ButtonRegular } from '../components/buttons';

function RequestDetails(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [error, setError] = useState('');
  const [release, setRelease] = useState({
    title: '',
    thumbnail: '',
    date: '',
    artist: {},
    tracks: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    }
  });

  const audioRef = useRef();

  const { id: userId } = props.match.params;
  const { tracks } = release;

  useEffect(() => {
    getPendingRelease(authState.token, userId)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setRelease({ ...release, ...res.data });
        } else {
          throw 'This user is already an artist or does not have a pending request.';
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server Error';
        }

        setError(err);
      });
  }, [userId]);

  const handleTestPlay = url => {
    audioRef.current.src = url;
  };

  const handleAction = action => {
    actionRequest(authState.token, userId, action)
      .then(res => {
        if (res.status === 'success') {
          switch (action) {
            case 'approve':
              libDispatch(
                libActions.setNotification(true, true, 'Request accepted')
              );
              break;
            case 'deny':
              libDispatch(
                libActions.setNotification(true, true, 'Request rejected.')
              );
              break;
            default:
              libDispatch(
                libActions.setNotification(true, false, 'Action not found.')
              );
          }
          setTimeout(() => {
            window.location.href = '/cms/requests';
          }, 500);
        } else {
          throw 'Failed to perform verify action.';
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  const handleLoadMore = () => {
    getPendingRelease(
      authState.token,
      userId,
      release.tracks.offset + release.tracks.limit
    ).then(res => {
      if (res.status === 'success' && res.data) {
        const newTracks = res.data.tracks;
        setRelease({
          ...release,
          tracks: {
            items: [...tracks.items, ...newTracks.items],
            offset: newTracks.offset,
            limit: newTracks.limit,
            total: newTracks.total
          }
        });
      }
    });
  };

  return firstRender ? (
    ''
  ) : (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-request-details fadein'>
        <section className='release-box'>
          <div className='left'>
            <div className='info'>
              <div className='thumbnail-wrapper'>
                <img
                  className='thumbnail'
                  src={release.thumbnail ? release.thumbnail : Placeholder}
                />
              </div>
              <div className='title-wrapper'>
                <span className='title font-short-big font-weight-bold ellipsis one-line'>
                  {release.title}
                </span>
                <span className='font-short-regular ellipsis one-line'>
                  {getDatePart(release.date)}
                </span>
              </div>
            </div>
            <div className='quick-player'>
              <audio src='' controls ref={audioRef} autoPlay></audio>
            </div>
          </div>
          <div className='right'>
            {error ? (
              <span className='font-short-regular'>{error}</span>
            ) : (
              <React.Fragment>
                <div className='tracks'>
                  <ul>
                    {tracks.items.map((track, index) => (
                      <li key={index}>
                        <div className='track-box'>
                          <div className='header'>
                            <span className='title ellipsis one-line'>{`#${index +
                              1} - ${track.title}`}</span>
                            <span className='duration'>
                              {getFormattedTime(track.duration / 1000)}
                            </span>
                          </div>
                          <div className='content'>
                            <div className='item-wrapper'>
                              <div className='item genres'>
                                {track.genres
                                  .map(genre => genre.name)
                                  .reduce((prev, curr) => [prev, ', ', curr])}
                              </div>
                            </div>
                            <div className='item-wrapper'>
                              <div className='item audio'>
                                <div
                                  className='btn-quick audio'
                                  onClick={() => {
                                    handleTestPlay(track.mp3128);
                                  }}
                                >
                                  128
                                </div>
                                <div
                                  className='btn-quick audio'
                                  onClick={() => {
                                    handleTestPlay(track.mp3320);
                                  }}
                                >
                                  320
                                </div>
                              </div>
                            </div>
                            {track.producer ? (
                              <div className='item-wrapper producer'>
                                <div className='item producer'>
                                  {track.producer}
                                </div>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {tracks.total > tracks.offset + tracks.limit ? (
                  <ButtonLoadMore onClick={handleLoadMore}>
                    Load more
                  </ButtonLoadMore>
                ) : (
                  ''
                )}

                <div className='actions'>
                  <ButtonRegular
                    className='approve'
                    onClick={() => {
                      handleAction('approve');
                    }}
                  >
                    APPROVE
                  </ButtonRegular>
                  <ButtonRegular
                    className='deny'
                    onClick={() => {
                      handleAction('deny');
                    }}
                  >
                    DENY
                  </ButtonRegular>
                </div>
              </React.Fragment>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default RequestDetails;
