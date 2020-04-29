import React, { useContext } from 'react';
import { LibraryContext } from '../../contexts';
import { Notification } from '../player/Player';
import './css/style.scss';
import { Footer, NavBar } from './parts';

function Landing({
  active = '',
  intro,
  body,
  extra = [],
  short = false,
  introClear = false
}) {
  const { state: libState } = useContext(LibraryContext);

  return (
    <div className='page-landing'>
      <div className='page-landing__nav side-space'>
        <NavBar active={active} />
      </div>
      <div className='page-landing__intro side-space'>
        {introClear ? (
          <React.Fragment>
            <div className='intro-background clear'></div>
            <div className='intro-layer clear'></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className='intro-background'></div>
            <div className='intro-layer'></div>
          </React.Fragment>
        )}
        {intro}
      </div>
      {body ? <div className='page-landing__body side-space'>{body}</div> : ''}
      <div className='extra'>{extra.map(extraBody => extraBody)}</div>
      <div className='page-landing__footer side-space'>
        <Footer short={short} />
      </div>
      {libState.notification.opened ? <Notification /> : ''}
    </div>
  );
}

export default Landing;
