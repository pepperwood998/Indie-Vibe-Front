import React from 'react';

import { NavBar, Footer } from './parts';

import './css/style.scss';

function Landing(props) {
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
    </div>
  );
}

export default Landing;
