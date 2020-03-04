import React, { useContext, useEffect } from 'react';

import { NavBar, Footer } from './parts';
import { getMeSimple } from '../../apis';
import { AuthContext, MeContext } from '../../contexts';

function Landing(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: meState, actions: meActions, dispatch: meDispatch } = useContext(MeContext);

  useEffect(() => {
    if (authState.token && !meState.id) {
      getMeSimple(authState.token)
        .then(response => response.json())
        .then(json => {
          if (json.status === 'success') {
            meDispatch(meActions.loadMe(json.data));
          }
        });
    } else if (!authState.token && meState.id) {
      meDispatch(meActions.unloadMe());
    }
  });

  return (
    <div className='page-landing'>
      <div className='page-landing__nav side-space'>
        <NavBar loggedIn={authState.token !== ''} />
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
