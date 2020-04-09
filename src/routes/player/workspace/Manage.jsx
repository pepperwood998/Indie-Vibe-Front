import React, { useContext, useEffect, useRef, useState } from 'react';
import { getTrackList, getTrackSimple } from '../../../apis/API';
import {
  deleteRelease,
  deleteTrack,
  setReleasePrivacy,
  updateReleaseDetails,
  updateTrack
} from '../../../apis/APIWorkspace';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { ButtonFrame, ButtonMain } from '../../../components/buttons';
import { GroupEmpty } from '../../../components/groups';
import {
  InputFileLabel,
  InputForm,
  InputGenre
} from '../../../components/inputs';
import { AuthContext, LibraryContext } from '../../../contexts';

const isMissing = (data = {}, exception = []) => {
  return Object.keys(data).some(key => {
    if (!exception.includes(key)) {
      const target = data[key];
      if (Array.isArray(target[1])) {
        return target[0] && target[1].length <= 0;
      }
      return target[0] && !target[1];
    }

    return false;
  });
};

function Manage(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [status, setStatus] = useState({
    existed: false,
    currentTrack: -1,
    submitted: false
  });
  const [tracks, setTracks] = useState({
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  });
  const [releaseDetails, setReleaseDetails] = useState({
    title: [false, ''],
    type: [false, ''],
    thumbnail: [false, '']
  });
  const [currentTrack, setCurrentTrack] = useState({
    title: [false, ''],
    genres: [false, []],
    producer: [false, ''],
    mp3128: [false, null],
    mp3320: [false, null]
  });
  const [extra, setExtra] = useState({
    thumbnailSrc: '',
    mp3128Src: '',
    mp3320Src: '',
    releaseStatus: 'public'
  });

  const ref = {
    thumbnail: useRef(),
    mp3128: useRef(),
    mp3320: useRef()
  };

  const { id } = props.match.params;
  const releaseTypes = [...libState.releaseTypes];

  useEffect(() => {
    getTrackList(authState.token, id, 'release')
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setStatus({ ...status, existed: true });
          const { data } = res;
          setReleaseDetails({
            ...releaseDetails,
            title: [false, data.title],
            type: [false, data.releaseType.id],
            thumbnail: [false, data.thumbnail]
          });
          setExtra({ ...extra, releaseStatus: data.status });
          setTracks({ ...data.tracks });
        } else {
          throw 'Error viewing release';
        }
      })
      .catch(err => {
        setStatus({ ...status, existed: false });
      });
  }, []);

  const handleChangeReleaseThumbnail = () => {
    let file = ref.thumbnail.current.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = e => {
        setReleaseDetails({
          ...releaseDetails,
          thumbnail: [true, file]
        });
        setExtra({ ...extra, thumbnailSrc: reader.result });
      };
    }
  };

  const handleChangeReleaseInfo = e => {
    const target = e.target;
    setReleaseDetails({
      ...releaseDetails,
      [target.getAttribute('name')]: [true, target.value]
    });
  };

  const handleEditTrack = index => {
    setStatus({ ...status, currentTrack: index });
    setExtra({ ...extra, mp3128Src: '', mp3320Src: '' });
    const target = { ...tracks.items[index] };
    setCurrentTrack({
      ...currentTrack,
      title: [false, target.title],
      genres: [false, target.genres],
      producer: [false, target.producer],
      mp3128: [false, null],
      mp3320: [false, null]
    });
  };

  const handleChangeTrackInfo = e => {
    const target = e.target;
    setCurrentTrack({
      ...currentTrack,
      [target.getAttribute('name')]: [true, target.value]
    });
  };

  const handleSaveGenresDialog = selected => {
    setCurrentTrack({
      ...currentTrack,
      genres: [true, [...selected]]
    });
  };

  const handleChangeMp3 = e => {
    const target = e.target;
    const mp3Type = target.getAttribute('name');
    const file = ref[mp3Type].current.files[0];
    if (file) {
      setCurrentTrack({ ...currentTrack, [mp3Type]: [true, file] });
      setExtra({ ...extra, [`${mp3Type}Src`]: file.name });
    }
  };

  const handleSaveReleaseDetails = () => {
    setStatus({ ...status, submitted: true });
    if (isMissing(releaseDetails)) {
      return;
    }

    libDispatch(
      libActions.setConfirmDialog(true, 'Confirm updating release?', () => {
        updateReleaseDetails(authState.token, id, releaseDetails)
          .then(res => {
            if (res.status === 'success') {
              libDispatch(
                libActions.setNotification(
                  true,
                  true,
                  'Release details updated'
                )
              );
            } else if (res.status === 'unchanged') {
              libDispatch(
                libActions.setNotification(
                  true,
                  true,
                  'Release details unchanged'
                )
              );
            } else {
              throw res.data;
            }
          })
          .catch(err => {
            if (typeof err !== 'string') {
              err = 'Server error';
            }

            libDispatch(libActions.setNotification(true, false, err));
          });
      })
    );
  };

  const handleSaveTrack = trackId => {
    setStatus({ ...status, submitted: true });
    if (isMissing(currentTrack, ['producer'])) {
      return;
    }

    libDispatch(
      libActions.setConfirmDialog(
        true,
        'Confirm updating release?',
        () => {
          setStatus({ ...status, currentTrack: -1 });
          let trackInfo = { ...currentTrack };
          if (currentTrack.genres[0]) {
            trackInfo.genres = [true, trackInfo.genres[1].map(g => g.id)];
          }
          updateTrack(authState.token, trackId, trackInfo)
            .then(putRes => {
              if (putRes.status === 'success') {
                libDispatch(
                  libActions.setNotification(true, true, 'Track updated')
                );
                return getTrackSimple(authState.token, trackId)
                  .then(getRes => {
                    if (getRes.status === 'success') {
                      const items = [...tracks.items];
                      items.some((item, i) => {
                        if (trackId === item.id) {
                          items[i] = { ...item, ...getRes.data };
                          return true;
                        }
                      });

                      setTracks({ ...tracks, items: [...items] });
                    } else {
                      throw getRes.data;
                    }
                  })
                  .catch(err => {
                    throw err;
                  });
              } else if (putRes.status === 'unchanged') {
                libDispatch(
                  libActions.setNotification(true, true, 'Track info unchanged')
                );
              } else {
                throw putRes.data;
              }
            })
            .catch(err => {
              if (typeof err !== 'string') {
                err = 'Server error';
              }

              libDispatch(libActions.setNotification(true, false, err));
            });
        },
        () => {
          setStatus({ ...status, currentTrack: -1 });
        }
      )
    );
  };

  const handleDeleteTrack = trackId => {
    libDispatch(
      libActions.setConfirmDialog(
        true,
        'Do you want to delete this track?',
        () => {
          deleteTrack(authState.token, trackId)
            .then(res => {
              if (res.status === 'success') {
                libDispatch(
                  libActions.setNotification(true, true, 'Track deleted')
                );

                const { items } = tracks;
                setTracks({
                  ...tracks,
                  items: items.filter(item => trackId !== item.id),
                  total: tracks.total - 1
                });
              } else {
                throw res.data;
              }
            })
            .catch(err => {
              if (typeof err !== 'string') {
                err = 'Server error';
              }

              libDispatch(libActions.setNotification(true, false, err));
            });
        }
      )
    );
  };

  const handleDeleteRelease = () => {
    libDispatch(
      libActions.setConfirmDialog(
        true,
        'Do you want to delete this release?',
        () => {
          deleteRelease(authState.token, id)
            .then(res => {
              if (res.status === 'success') {
                libDispatch(
                  libActions.setNotification(
                    true,
                    true,
                    'Release deleted successfully'
                  )
                );
                window.location.href = '/player/workspace';
              } else {
                throw res.data;
              }
            })
            .catch(err => {
              if (typeof err !== 'string') {
                err = 'Server error';
              }

              libDispatch(libActions.setNotification(true, false, err));
            });
        }
      )
    );
  };

  const handleSetReleasePrivacy = action => {
    setReleasePrivacy(authState.token, id, action)
      .then(res => {
        if (res.status === 'success') {
          setExtra({
            ...extra,
            releaseStatus: action === 'make-public' ? 'public' : 'private'
          });
          libDispatch(libActions.setNotification(true, true, res.data));
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={!status.existed} message='Release not found'>
      <div className='content-page fadein'>
        <div className='manage-release mono-page content-padding'>
          <section className='release-details catalog'>
            <div className='catalog__header'>
              <span className='font-short-semi font-weight-bold font-white'>
                Release details
              </span>
            </div>
            <div className='content catalog__body'>
              <InputFileLabel
                for='thumbnail'
                error={
                  status.submitted &&
                  releaseDetails.thumbnail[0] &&
                  !releaseDetails.thumbnail[1]
                }
                keep={true}
                className='input-custom__label--img'
              >
                <div className='thumbnail'>
                  <div className='img-wrapper'>
                    <input
                      type='file'
                      name='thumbnail'
                      id='thumbnail'
                      ref={ref.thumbnail}
                      className='input-custom'
                      accept='image/*'
                      onChange={handleChangeReleaseThumbnail}
                    />
                    <img
                      src={
                        releaseDetails.thumbnail[0]
                          ? extra.thumbnailSrc
                            ? extra.thumbnailSrc
                            : Placeholder
                          : releaseDetails.thumbnail[1]
                      }
                      className='img'
                    />
                  </div>
                </div>
              </InputFileLabel>
              <div className='details'>
                <InputForm
                  placeholder='Enter release title'
                  name='title'
                  value={releaseDetails.title[1]}
                  onChange={handleChangeReleaseInfo}
                  error={
                    status.submitted &&
                    releaseDetails.title[0] &&
                    releaseDetails.title[1] === ''
                  }
                  errMessage='Missing release title'
                />
                <select
                  name='type'
                  className='custom-select release-type'
                  value={releaseDetails.type[1]}
                  onChange={handleChangeReleaseInfo}
                >
                  {releaseTypes.map((type, index) => (
                    <option value={type.id} key={index}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='submit'>
                <ButtonMain onClick={handleSaveReleaseDetails}>SAVE</ButtonMain>
              </div>

              {extra.releaseStatus === 'public' ? (
                <span
                  className='action link link-underline'
                  onClick={() => {
                    handleSetReleasePrivacy('make-private');
                  }}
                >
                  Make private
                </span>
              ) : (
                <span
                  className='action link link-underline'
                  onClick={() => {
                    handleSetReleasePrivacy('make-public');
                  }}
                >
                  Make public
                </span>
              )}
            </div>
          </section>
          <section className='tracks-list'>
            <div className='catalog__header'>
              <span className='font-short-semi font-weight-bold font-white'>
                Tracks lists
              </span>
            </div>
            <div className='content catalog__body'>
              <ul>
                {tracks.items.map((item, index) => (
                  <li key={index}>
                    <div className='track'>
                      <div className='table-layout'>
                        {/* input: track title */}
                        <div className='table-row'>
                          <span className='label'>Title: </span>
                          {status.currentTrack === index ? (
                            <InputForm
                              placeholder='Enter song title'
                              name='title'
                              value={currentTrack.title[1]}
                              onChange={handleChangeTrackInfo}
                              error={
                                status.submitted && currentTrack.title[1] === ''
                              }
                              errMessage='Missing song name'
                            />
                          ) : (
                            <span className='data'>{item.title}</span>
                          )}
                        </div>
                        {/* input: track genres */}
                        <div className='table-row'>
                          <span className='label'>Genres: </span>
                          {status.currentTrack === index ? (
                            <span className='font-short-regular font-gray-light'>
                              {currentTrack.genres[1].length > 0
                                ? currentTrack.genres[1]
                                    .map(g => g.name)
                                    .reduce((prev, curr) => [prev, ', ', curr])
                                : ''}
                              <InputGenre
                                onClick={() => {
                                  libDispatch(
                                    libActions.setGenresDialog(
                                      true,
                                      currentTrack.genres[1],
                                      handleSaveGenresDialog
                                    )
                                  );
                                }}
                                error={
                                  status.submitted &&
                                  currentTrack.genres[1].length <= 0
                                }
                              />
                            </span>
                          ) : (
                            <span className='font-short-regular font-gray-light'>
                              {item.genres.length > 0
                                ? item.genres
                                    .map(g => g.name)
                                    .reduce((prev, curr) => [prev, ', ', curr])
                                : ''}
                            </span>
                          )}
                        </div>
                        {/* input: track mp3 files */}
                        {status.currentTrack === index ? (
                          <React.Fragment>
                            <div className='table-row'>
                              <span className='label'>MP3 128:</span>
                              <InputFileLabel
                                for='mp3128'
                                keep={false}
                                error={
                                  status.submitted &&
                                  currentTrack.mp3128[0] &&
                                  !currentTrack.mp3320[1]
                                }
                                errMessage='Missing 128kbps mp3 file'
                              >
                                {extra.mp3128Src
                                  ? extra.mp3128Src
                                  : 'Choose 128kbps file'}
                              </InputFileLabel>
                            </div>
                            <div className='table-row'>
                              <span className='label'>MP3 320:</span>
                              <InputFileLabel
                                for='mp3320'
                                keep={false}
                                error={
                                  status.submitted &&
                                  currentTrack.mp3320[0] &&
                                  !currentTrack.mp3320[1]
                                }
                                errMessage='Missing 320kbps mp3 file'
                              >
                                {extra.mp3320Src
                                  ? extra.mp3320Src
                                  : 'Choose 320kbps file'}
                              </InputFileLabel>
                            </div>
                          </React.Fragment>
                        ) : (
                          ''
                        )}
                        {/* input: track producer */}
                        <div className='table-row'>
                          <span className='label'>Producer: </span>
                          {status.currentTrack === index ? (
                            <InputForm
                              placeholder='Enter producer team'
                              name='producer'
                              value={currentTrack.producer[1]}
                              onChange={handleChangeTrackInfo}
                            />
                          ) : (
                            <span className='data'>{item.producer}</span>
                          )}
                        </div>
                        {/* submit: track save button */}
                        {status.currentTrack === index ? (
                          <div className='table-row'>
                            <span></span>
                            <span>
                              <ButtonMain
                                isFitted
                                onClick={() => {
                                  handleSaveTrack(item.id);
                                }}
                              >
                                SAVE TRACK
                              </ButtonMain>
                              <ButtonFrame
                                className='ml-2'
                                isFitted
                                onClick={() => {
                                  setStatus({ ...status, currentTrack: -1 });
                                }}
                              >
                                CANCEL
                              </ButtonFrame>
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      {status.currentTrack === index ? (
                        <React.Fragment>
                          <input
                            id='mp3128'
                            type='file'
                            accept='.mp3'
                            name='mp3128'
                            ref={ref.mp3128}
                            onChange={handleChangeMp3}
                            className='input-custom'
                          />
                          <input
                            id='mp3320'
                            type='file'
                            accept='.mp3'
                            name='mp3320'
                            ref={ref.mp3320}
                            onChange={handleChangeMp3}
                            className='input-custom'
                          />
                        </React.Fragment>
                      ) : (
                        <div className='actions'>
                          <span
                            className='item'
                            onClick={() => handleEditTrack(index)}
                          >
                            Edit
                          </span>
                          <span
                            className='item'
                            onClick={() => handleDeleteTrack(item.id)}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section>
            <ButtonMain className='dangerous' onClick={handleDeleteRelease}>
              DELETE RELEASE
            </ButtonMain>
          </section>
        </div>
      </div>
    </GroupEmpty>
  );
}

export default Manage;
