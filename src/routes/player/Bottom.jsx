import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLinkUnderline } from '../../components/links';

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

function NowPayingMiddle() {
  return (
    <div className='player-controls'>
      <div className='player-controls__action'>
        <div className='player-action-wrapper'>
          <SkipPreviousIcon />
        </div>
        <div className='player-action-wrapper'>
          <PlayIcon />
        </div>
        <div className='player-action-wrapper'>
          <SkipNextIcon />
        </div>
      </div>
      <div className='player-controls__progress'>
        <div className='progress-time font-tall-r font-weight-bold font-gray-light'>
          0:00
        </div>
        <ProgressBar />
        <div className='progress-time font-tall-r font-weight-bold font-gray-light'>
          3:59
        </div>
      </div>
    </div>
  );
}

function ProgressBar() {
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
    console.log('up');
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
          style={{ width: progress.percent + '%' }}
        ></div>
        <div
          className='ivb-progress-bar__thumb'
          style={{ left: progress.width - 5 + 'px' }}
        ></div>
      </div>
    </div>
  );
}

function NowPayingRight() {
  return (
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
  );
}

export default Bottom;
