import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { NavLinkUnderline } from '../../components/links';
import { StreamContext } from '../../contexts/StreamContext';

import Placeholder from '../../assets/imgs/placeholder.png';
import {
  UnFavoriteIcon,
  SkipPreviousIcon,
  PlayIcon,
  SkipNextIcon,
  RepeatOffIcon,
  ShuffleIcon,
  MusicQueueIcon,
  UnmuteIcon,
  MuteIcon,
  PauseIcon,
  RepeatListIcon,
  RepeatTrackIcon,
  UnShuffleIcon,
  FavoriteIcon
} from '../../assets/svgs';
import { performActionFavorite } from '../../apis/API';
import { AuthContext, LibraryContext } from '../../contexts';

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
            href={
              playFromType
                ? playFromType === 'favorite'
                  ? `/player/library/${authState.id}/tracks`
                  : `/player/${playFromType}/${playFromId}`
                : '/player/queue'
            }
            className='font-short-regular font-weight-bold font-white'
          >
            {title}
          </NavLinkUnderline>
          <div>
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
            className='svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.skipBackward());
            }}
          />
        </div>
        <div className='player-action-wrapper'>
          {streamState.paused ? (
            <PlayIcon
              className='svg--cursor svg--bright'
              onClick={() => {
                streamDispatch(streamActions.togglePaused());
              }}
            />
          ) : (
            <PauseIcon
              className='svg--cursor svg--bright'
              onClick={() => {
                streamDispatch(streamActions.togglePaused());
              }}
            />
          )}
        </div>
        <div className='player-action-wrapper'>
          <SkipNextIcon
            className='svg--cursor svg--bright'
            onClick={() => {
              streamDispatch(streamActions.skipForward());
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
          <MusicQueueIcon className='svg--small svg--cursor svg--bright' />
        </div>
        <div className='control-wrapper control-volume'>
          {!streamState.muted && streamState.volume !== 0 ? (
            <UnmuteIcon
              className='svg--small svg--cursor svg--bright'
              onClick={handleMute}
            />
          ) : (
            <MuteIcon
              className='svg--small svg--cursor svg--bright'
              onClick={handleUnmute}
            />
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
        <RepeatOffIcon
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            streamDispatch(streamActions.setRepeat('one'));
          }}
        />
      );
    case 'one':
      return (
        <RepeatTrackIcon
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            streamDispatch(streamActions.setRepeat('all'));
          }}
        />
      );
    case 'all':
      return (
        <RepeatListIcon
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            streamDispatch(streamActions.setRepeat('none'));
          }}
        />
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
      <UnShuffleIcon
        className='svg--small svg--cursor svg--bright'
        onClick={() => {
          streamDispatch(streamActions.setShuffle(false));
        }}
      />
    );
  } else {
    return (
      <ShuffleIcon
        className='svg--small svg--cursor svg--bright'
        onClick={() => {
          streamDispatch(streamActions.setShuffle(true));
        }}
      />
    );
  }
}

export default Bottom;
