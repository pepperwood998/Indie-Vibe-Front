import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { performActionFavorite } from '../../apis/API';
import Placeholder from '../../assets/imgs/placeholder.png';
import {
  FavoriteIcon,
  MusicQueueIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  RepeatListIcon,
  RepeatOffIcon,
  RepeatTrackIcon,
  ShuffleIcon,
  SkipNextIcon,
  SkipPreviousIcon,
  UnFavoriteIcon,
  UnmuteIcon,
  UnShuffleIcon
} from '../../assets/svgs';
import { NavLinkUnderline } from '../../components/links';
import Tooltip from '../../components/tooltips/Tooltip';
import { AuthContext, LibraryContext, MeContext } from '../../contexts';
import { StreamContext } from '../../contexts/StreamContext';

function Bottom() {
  return (
    <div className='now-playing-bar'>
      <div className='now-playing-bar__left'>
        <NowPayingLeft />
      </div>
      <div className='now-playing-bar__middle'>
        <NowPayingMiddle />
      </div>
      <div className='now-playing-bar__right'>
        <NowPayingRight />
      </div>
    </div>
  );
}

function NowPayingLeft() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const { id, title, artists, release, relation } = streamState.info;
  const { playFromType, playFromId } = streamState;

  const artistSeparator = (
    <span className='font-short-s font-gray-light'>, </span>
  );

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

  if (id) {
    let titleLink = '';
    if (streamState.queue[streamState.currentSongIndex].from === 'queue') {
      titleLink = '/player/queue';
    } else {
      if (playFromType === 'release' || playFromType === 'playlist') {
        titleLink = `/player/${playFromType}/${playFromId}`;
      } else if (playFromType === 'favorite') {
        titleLink = `/player/library/${authState.id}/tracks`;
      }
    }

    return (
      <div className='now-playing'>
        <div className='now-playing__cover-container'>
          <div className='dummy'></div>
          <Link to={`/player/release/${release.id}`}>
            <img src={release.thumbnail ? release.thumbnail : Placeholder} />
          </Link>
        </div>
        <div className='now-playing__info'>
          <NavLinkUnderline
            href={titleLink}
            className='font-short-regular font-weight-bold font-white ellipsis one-line'
          >
            {title}
          </NavLinkUnderline>
          <div className='ellipsis one-line'>
            {artists
              ? artists
                  .map(artist => (
                    <NavLinkUnderline
                      href={`/player/artist/${artist.id}`}
                      className='font-short-s font-gray-light'
                      key={artist.id}
                    >
                      {artist.displayName}
                    </NavLinkUnderline>
                  ))
                  .reduce((prev, curr) => [prev, artistSeparator, curr])
              : ''}
          </div>
        </div>
        <div className='now-playing__action'>
          {relation.includes('favorite') ? (
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
      </div>
    );
  } else {
    return '';
  }
}

function NowPayingMiddle() {
  const [progressTime, setProgressTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [progressPer, setProgressPer] = useState(0);

  const { state: authState } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const audioRef = useRef();

  useEffect(() => {
    streamDispatch(
      streamActions.init({
        audio: audioRef.current,
        onProgress: (time, per) => {
          setProgressTime(time);
          setProgressPer(per);
        },
        onDurationChange: duration => {
          setDuration(duration);
        }
      })
    );

    return () => {
      streamDispatch(streamActions.clean());
    };
  }, []);

  return (
    <div className='player-controls'>
      <audio ref={audioRef}></audio>
      <div className='player-controls__action'>
        <div className='player-action-wrapper'>
          <SkipPreviousIcon
            className='svg--big svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.skipBackward(role.id));
            }}
          />
        </div>
        <div className='player-action-wrapper'>
          {streamState.loading ? (
            <div className='play-loading'>
              <div className='loader loader-1'>
                <span></span>
              </div>
              <PlayIcon className='icon svg--small svg--disabled' />
            </div>
          ) : streamState.paused ? (
            <PlayIcon
              className='svg--big svg--cursor svg--bright'
              onClick={() => {
                streamDispatch(streamActions.togglePaused());
              }}
            />
          ) : (
            <PauseIcon
              className='svg--big svg--cursor svg--bright'
              onClick={() => {
                streamDispatch(streamActions.togglePaused());
              }}
            />
          )}
        </div>
        <div className='player-action-wrapper'>
          <SkipNextIcon
            className='svg--big svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.skipForward(role.id));
            }}
          />
        </div>
      </div>
      <div className='player-controls__progress'>
        <div className='progress-time font-tall-r font-weight-bold font-gray-light'>
          {progressTime}
        </div>
        <ProgressBar
          progressPer={progressPer}
          seek={per => {
            streamDispatch(streamActions.seek(per));
          }}
        />
        <div className='progress-time font-tall-r font-weight-bold font-gray-light'>
          {duration}
        </div>
      </div>
    </div>
  );
}

function ProgressBar(props) {
  const [progress, setProgress] = useState({
    percent: 0,
    width: 0
  });
  const [clicked, setClicked] = useState(false);
  const inputRef = useRef();

  const handleClick = e => {
    setClicked(true);
    let rect = inputRef.current.getBoundingClientRect();
    let progressWidth = Math.max(
      0,
      Math.min(e.nativeEvent.clientX - rect.x, rect.width)
    );
    setProgress({
      ...progress,
      percent: (progressWidth / rect.width) * 100,
      width: progressWidth
    });
  };

  const handleMouseUp = e => {
    setClicked(false);
    if (props.seek) props.seek(progress.percent);
  };

  const handleMouseMove = e => {
    if (clicked) {
      let rect = inputRef.current.getBoundingClientRect();
      let progressWidth = Math.max(
        0,
        Math.min(e.nativeEvent.clientX - rect.x, rect.width)
      );
      setProgress({
        ...progress,
        percent: (progressWidth / rect.width) * 100,
        width: progressWidth
      });
    }
  };

  return (
    <div className='ivb-progress-bar'>
      <div
        className='ivb-progress-bar__full'
        onMouseDown={handleClick}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={inputRef}
      >
        <div
          className='ivb-progress-bar__progress'
          style={{
            width: (clicked ? progress.percent : props.progressPer) + '%'
          }}
        ></div>
        <div
          className='ivb-progress-bar__thumb'
          style={{
            left: (clicked ? progress.percent : props.progressPer) + '%'
          }}
        ></div>
      </div>
    </div>
  );
}

function NowPayingRight() {
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const handleMute = () => {
    streamDispatch(streamActions.setMuted(true));
  };
  const handleUnmute = () => {
    streamDispatch(streamActions.setMuted(false));
  };

  return (
    <div className='extra-controls-wrapper'>
      <div className='extra-controls'>
        <div className='control-wrapper'>
          <RepeatControl />
        </div>
        <div className='control-wrapper'>
          <ShuffleControl />
        </div>
        <div className='control-wrapper'>
          <Tooltip tooltip='Play queue'>
            <MusicQueueIcon className='svg--small svg--cursor svg--bright' />
          </Tooltip>
        </div>
        <div className='control-wrapper control-volume'>
          {!streamState.muted && streamState.volume !== 0 ? (
            <Tooltip tooltip='Mute'>
              <UnmuteIcon
                className='svg--small svg--cursor svg--bright'
                onClick={handleMute}
              />
            </Tooltip>
          ) : (
            <Tooltip tooltip='Unmute'>
              <MuteIcon
                className='svg--small svg--cursor svg--bright'
                onClick={handleUnmute}
              />
            </Tooltip>
          )}
          <ProgressBar
            progressPer={streamState.muted ? 0 : streamState.volume}
            seek={per => {
              streamDispatch(streamActions.volume(per));
            }}
          />
        </div>
      </div>
    </div>
  );
}

function RepeatControl() {
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  switch (streamState.repeat) {
    case 'none':
      return (
        <Tooltip tooltip='Repeat one'>
          <RepeatOffIcon
            className='svg--small svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.setRepeat('one'));
            }}
          />
        </Tooltip>
      );
    case 'one':
      return (
        <Tooltip tooltip='Repeat all'>
          <RepeatTrackIcon
            className='svg--small svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.setRepeat('all'));
            }}
          />
        </Tooltip>
      );
    case 'all':
      return (
        <Tooltip tooltip='Repeat off'>
          <RepeatListIcon
            className='svg--small svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.setRepeat('none'));
            }}
          />
        </Tooltip>
      );
    default:
      return '';
  }
}

function ShuffleControl() {
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  if (streamState.shuffled) {
    return (
      <Tooltip tooltip='Shuffle off'>
        <UnShuffleIcon
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            streamDispatch(streamActions.setShuffle(false));
          }}
        />
      </Tooltip>
    );
  } else {
    return (
      <Tooltip tooltip='Shuffle'>
        <ShuffleIcon
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            streamDispatch(streamActions.setShuffle(true));
          }}
        />
      </Tooltip>
    );
  }
}

export default Bottom;
