import React, { useContext } from 'react';
import { LibraryContext } from '../../contexts';
import { Notification } from '../player/Player';
import './css/style.scss';
import { Footer, NavBar } from './parts';

function Landing(props) {
  const { state: libState } = useContext(LibraryContext);

  return (
    <div className='page-landing'>
      <div className='page-landing__nav side-space'>
        <NavBar active={props.active} />
      </div>
      <div className='page-landing__intro side-space'>
        <div className='intro-background'></div>
        <div className='intro-layer'></div>
        {props.intro}
      </div>
      {props.body ? (
        <div className='page-landing__body side-space'>{props.body}</div>
      ) : (
        ''
      )}
      <div className='page-landing__footer side-space'>
        <Footer short={props.short} />
      </div>
      {libState.notification.opened ? <Notification /> : ''}
    </div>
  );
}

export default Landing;
