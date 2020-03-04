import React, { useContext } from 'react';

import { NavBar, Footer } from './parts';
import { AuthContext } from '../../contexts/AuthContext';

function Landing(props) {
  const { state, actions, dispatch } = useContext(AuthContext);

  return (
    <div className='page-landing'>
      <div className='page-landing__nav side-space'>
        <NavBar loggedIn={state.token !== ''} />
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
