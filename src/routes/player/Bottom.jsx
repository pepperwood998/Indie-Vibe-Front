import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { NavLinkUnderline } from '../../components/links';
import { StreamContext } from '../../contexts/StreamContext';

import AvatarPlaceholder from '../../assets/imgs/placeholder.png';
import {
  FavoriteIcon,
  SkipPreviousIcon,
  PlayIcon,
  SkipNextIcon,
  RepeatOffIcon,
  ShuffleIcon,
  MusicQueueIcon,
  UnmuteIcon
} from '../../assets/svgs';

function Bottom() {
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch,
    stream
  } = useContext(StreamContext);

  return (
    <div className='now-playing-bar'>
      <div className='now-playing-bar__left'>
        <NowPayingLeft
          streamActions={streamActions}
          streamDispatch={streamDispatch}
          stream={stream}
        />
      </div>
      <div className='now-playing-bar__middle'>
        <NowPayingMiddle
          streamActions={streamActions}
          streamDispatch={streamDispatch}
          stream={stream}
        />
      </div>
      <div className='now-playing-bar__right'>
        <NowPayingRight />
      </div>
    </div>
  );
}

function NowPayingLeft(props) {
  return (
    <div className='now-playing'>
      <div className='now-playing__cover-container'>
        <Link to='/player'>
          <img src={AvatarPlaceholder} />
        </Link>
      </div>
      <div className='now-playing__info'>
        <NavLinkUnderline
          href='/player'
          className='font-short-regular font-weight-bold font-white'
        >
          Muông Thú
        </NavLinkUnderline>
        <NavLinkUnderline
          href='/player'
          className='font-short-s font-gray-light'
        >
          Cá Hồi Hoang
        </NavLinkUnderline>
      </div>
      <div className='now-playing__action'>
        <FavoriteIcon />
      </div>
    </div>
  );
}

function NowPayingMiddle(props) {
  const [progressTime, setProgressTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [progressPer, setProgressPer] = useState(0);
  const [init, setInit] = useState(false);

  const { stream, streamActions, streamDispatch } = props;

  useEffect(() => {
    if (!init) {
      stream.onProgress = (timeProgress, per) => {
        setProgressTime(timeProgress);
        setProgressPer(per);
      };
      stream.onTrackFormatted = duration => {
        setDuration(duration);
      };
      setInit(true);
    }
  }, [init]);

  return (
    <div className='player-controls'>
      <div className='player-controls__action'>
        <div className='player-action-wrapper'>
          <SkipPreviousIcon
            onClick={() => {
              streamDispatch(streamActions.skipBackward());
              streamDispatch(streamActions.somePlay());
            }}
          />
        </div>
        <div className='player-action-wrapper'>
          <PlayIcon
            onClick={() => {
              streamDispatch(streamActions.togglePlay());
            }}
          />
        </div>
        <div className='player-action-wrapper'>
          <SkipNextIcon
            onClick={() => {
              streamDispatch(streamActions.skipForward());
              streamDispatch(streamActions.somePlay());
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

  useEffect(() => {
    // window.addEventListener('mousemove', handleMouseMove);
    // window.addEventListener('mouseup', handleMouseUp);
  });

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
  return (
    <div className='extra-controls-wrapper'>
      <div className='extra-controls'>
        <div className='control-wrapper'>
          <RepeatOffIcon />
        </div>
        <div className='control-wrapper'>
          <ShuffleIcon />
        </div>
        <div className='control-wrapper'>
          <MusicQueueIcon />
        </div>
        <div className='control-wrapper control-volume'>
          <UnmuteIcon />
          <ProgressBar />
        </div>
      </div>
    </div>
  );
}

export default Bottom;
