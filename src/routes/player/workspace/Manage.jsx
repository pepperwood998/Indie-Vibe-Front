import React, { useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getTrackList, getTrackSimple } from '../../../apis/API';
import {
  addSongsToRelease,
  deleteRelease,
  deleteTrack,
  setReleasePrivacy,
  updateReleaseDetails,
  updateTrack
} from '../../../apis/APIWorkspace';
import Loading from '../../../assets/imgs/loading.gif';
import Placeholder from '../../../assets/imgs/placeholder.png';
import {
  ButtonFrame,
  ButtonLoadMore,
  ButtonMain
} from '../../../components/buttons';
import { GroupEmpty, GroupTrackUpload } from '../../../components/groups';
import { missingSomething } from '../../../components/groups/GroupReleaseUpload';
import { usePageTitle } from '../../../components/hooks';
import {
  InputFileLabel,
  InputForm,
  InputGenre
} from '../../../components/inputs';
import { AuthContext, LibraryContext } from '../../../contexts';
import { genOneValueArr, isMissing, model } from '../../../utils/Common';

const refreshUpdating = (index = 0, updating = [], value = false) => {
  let updatingTmp = [...updating];
  updatingTmp.some((item, i) => {
    if (index === i) {
      updatingTmp[i] = value;
      return true;
    }
  });

  return updatingTmp;
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
    existed: true,
    currentTrack: -1,
    submitted: false,
    adding: false
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
  const [updating, setUpdating] = useState([]);

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
        if (res.status === 'success' && res.data) {
          setStatus({ ...status, existed: true });
          const { data } = res;
          if (!data.relation.includes('own')) {
            throw 'limited';
          }

          setFirstRender(false);
          setReleaseDetails({
            ...releaseDetails,
            title: [false, data.title],
            type: [false, data.releaseType.id],
            thumbnail: [false, data.thumbnail]
          });
          setExtra({ ...extra, releaseStatus: data.status });

          setTracks({ ...data.tracks });
          setUpdating(genOneValueArr(data.tracks.items.length, false));
        } else {
          throw 'Error viewing release';
        }
      })
      .catch(err => {
        if (err === 'limited') {
          window.location.href = '/player/workspace';
        } else {
          setFirstRender(false);
          setStatus({ ...status, existed: false });
        }
      });
  }, []);

  usePageTitle('Manage', true);

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
          setUpdating(refreshUpdating(status.currentTrack, updating, true));

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
                let updatedRes = [...updating];
                updatedRes.some((value, index) => {
                  if (index === status.currentTrack) {
                    updatedRes[index] = false;
                    return true;
                  }
                });
                setUpdating([...updatedRes]);

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

              setUpdating(
                refreshUpdating(status.currentTrack, updating, false)
              );
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

  const handleLoadMore = () => {
    getTrackList(authState.token, id, 'release', tracks.offset + tracks.limit)
      .then(res => {
        if (res.status === 'success') {
          const newTracks = res.data.tracks;

          setTracks({
            ...tracks,
            ...newTracks,
            items: [...tracks.items, ...newTracks.items]
          });
          setUpdating([
            ...updating,
            ...genOneValueArr(newTracks.items.length, false)
          ]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
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
              {firstRender ? (
                <div className='thumbnail'>
                  <Skeleton width='100%' height='100%' />
                </div>
              ) : (
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
                    <div className='img-wrapper edit'>
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
              )}
              <div className='details'>
                {firstRender ? (
                  <section>
                    <Skeleton width={200} />
                  </section>
                ) : (
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
                )}
                {firstRender ? (
                  <section>
                    <Skeleton width={150} />
                  </section>
                ) : (
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
                )}
              </div>
              <div className='submit'>
                {firstRender ? (
                  <Skeleton width={100} height={40} />
                ) : (
                  <ButtonMain onClick={handleSaveReleaseDetails}>
                    SAVE
                  </ButtonMain>
                )}
              </div>

              {firstRender ? (
                ''
              ) : extra.releaseStatus === 'public' ? (
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

          {!status.adding ? (
            <section className='tracks-list catalog'>
              <div className='catalog__header'>
                <span className='font-short-semi font-weight-bold font-white'>
                  Tracks lists
                </span>
              </div>
              <div className='content catalog__body'>
                <ul>
                  {firstRender ? (
                    <Skeleton count={3} height={100} />
                  ) : (
                    tracks.items.map((item, index) => (
                      <li key={index} style={{ position: 'relative' }}>
                        {updating[index] ? (
                          <div className='updating d-flex justify-content-center align-items-center'>
                            <img src={Loading} className='loading' />
                          </div>
                        ) : (
                          ''
                        )}
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
                                    status.submitted &&
                                    currentTrack.title[1] === ''
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
                                  {currentTrack.genres[1]
                                    .map(g => g.name)
                                    .join(', ')}
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
                                  {item.genres.map(g => g.name).join(', ')}
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
                                      !currentTrack.mp3128[1]
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
                                    onClick={() => {
                                      handleSaveTrack(item.id);
                                    }}
                                  >
                                    SAVE TRACK
                                  </ButtonMain>
                                  <ButtonFrame
                                    className='ml-2'
                                    onClick={() => {
                                      setStatus({
                                        ...status,
                                        currentTrack: -1
                                      });
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
                    ))
                  )}
                </ul>

                {tracks.total > tracks.offset + tracks.limit ? (
                  <ButtonLoadMore onClick={handleLoadMore}>
                    Load more
                  </ButtonLoadMore>
                ) : (
                  ''
                )}
                <div className='clearfix mt-3'>
                  {firstRender ? (
                    <div className='float-right'>
                      <Skeleton width={150} height={40} />
                    </div>
                  ) : (
                    <ButtonMain
                      className='float-right'
                      onClick={() => {
                        setStatus({ ...status, adding: true });
                      }}
                    >
                      ADD SONGS
                    </ButtonMain>
                  )}
                  {firstRender ? (
                    <div className='float-left'>
                      <Skeleton width={150} height={40} />
                    </div>
                  ) : (
                    <ButtonMain
                      className='dangerous float-left'
                      onClick={handleDeleteRelease}
                    >
                      DELETE RELEASE
                    </ButtonMain>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className='catalog fadein'>
              <div className='catalog__header'>
                <span className='font-short-semi font-weight-bold font-white'>
                  Add songs
                </span>
                <span
                  className='float-right link link-underline font-short-s font-gray-light'
                  onClick={() => {
                    libDispatch(
                      libActions.setConfirmDialog(
                        true,
                        'Cancel adding songs?',
                        () => {
                          setStatus({ ...status, adding: false });
                        }
                      )
                    );
                  }}
                >
                  Cancel Add Songs
                </span>
              </div>
              <div className='catalog__body'>
                <AddSongs releaseId={id} />
              </div>
            </section>
          )}
        </div>
      </div>
    </GroupEmpty>
  );
}

function AddSongs({ releaseId = '' }) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [tracks, setTracks] = useState([
    {
      title: '',
      genres: [],
      producer: ''
    }
  ]);
  const [audio, setAudio] = useState([{ audio128: null, audio320: null }]);
  const [audioSrc, setAudioSrc] = useState([
    { audio128: null, audio320: null }
  ]);
  const [status, setStatus] = useState({
    submitted: false
  });

  const handleItemChange = (index, newInfo, newAudio, newAudioSrc) => {
    setTracks(
      tracks.map((track, i) => {
        if (index === i) {
          return {
            ...track,
            ...newInfo
          };
        }

        return track;
      })
    );
    setAudio(
      audio.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newAudio
          };
        }

        return item;
      })
    );
    setAudioSrc(
      audioSrc.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newAudioSrc
          };
        }

        return item;
      })
    );
  };

  const handleItemDelete = index => {
    setTracks(tracks.filter((item, i) => index !== i));
    setAudio(audio.filter((item, i) => index !== i));
    setAudioSrc(audioSrc.filter((item, i) => index !== i));
  };

  const handleAddSong = () => {
    setTracks([...tracks, { ...model.track }]);
    setAudio([...audio, { ...model.audio }]);
    setAudioSrc([...audioSrc, { ...model.audio }]);
  };

  const handlePublish = () => {
    setStatus({ ...status, submitted: true });
    if (missingSomething(tracks, audio)) {
      return;
    }

    libDispatch(
      libActions.setConfirmDialog(true, 'Confirm adding songs?', () => {
        libDispatch(libActions.setProgressDialog(true, 'ADDING SONG...', 0));
        let processedTracks = tracks.map(track => ({
          title: track.title,
          producer: track.producer,
          genres: track.genres.map(g => g.id)
        }));
        addSongsToRelease(
          authState.token,
          releaseId,
          processedTracks,
          audio,
          per => {
            libDispatch(libActions.updateProgress(per));
          }
        )
          .then(res => {
            libDispatch(libActions.setProgressDialog(false, '', 0));
            if (res.status === 'success') {
              libDispatch(
                libActions.setNotification(true, true, 'New songs added')
              );
              setTimeout(() => {
                window.location.href = `/player/manage/${releaseId}`;
              }, 500);
            } else throw res.data;
          })
          .catch(err => {
            libDispatch(libActions.setProgressDialog(false, '', 0));
            if (typeof err !== 'string') {
              err = 'Server error';
            }

            libDispatch(libActions.setNotification(true, false, err));
          });
      })
    );
  };

  return (
    <div className='content'>
      {tracks.map((track, i) => (
        <div className='upload-item' key={i}>
          <GroupTrackUpload
            index={i}
            handleItemChange={handleItemChange}
            handleItemDelete={handleItemDelete}
            info={tracks[i]}
            audio={audio[i]}
            audioSrc={audioSrc[i]}
            submitted={status.submitted}
          />
        </div>
      ))}

      <div className='clearfix mt-3'>
        <ButtonMain className='float-right' onClick={handleAddSong}>
          ADD ITEM
        </ButtonMain>
        <ButtonFrame className='float-left' onClick={handlePublish}>
          PUBLISH
        </ButtonFrame>
      </div>
    </div>
  );
}

export default Manage;
