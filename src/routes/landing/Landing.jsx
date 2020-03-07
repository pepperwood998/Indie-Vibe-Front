import React from 'react';

import { NavBar, Footer } from './parts';

function Landing(props) {
  return (
    <div className='page-landing'>
      <div className='page-landing__nav side-space'>
        <NavBar />
      </div>
      <div className='page-landing__intro side-space'>
        <div className='intro-background'></div>
        <div className='intro-layer'></div>
        {props.intro}
      </div>
      <div className='page-landing__body side-space'>{props.body}</div>
      <div className='page-landing__footer side-space'>
        <Footer />
      </div>
    </div>
  );
}

export default Landing;
