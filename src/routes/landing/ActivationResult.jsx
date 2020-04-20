import React, { useEffect, useState } from 'react';
import { activate } from '../../apis/AuthAPI';
import Landing from './Landing';
import { Activation } from './parts';

function ActivationResult({ match, location }) {
  const [activated, setActivated] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [resent, setResent] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const activateToken = searchParams.get('activateToken');
  let classes = 'content page-activation';
  classes += !activated && !resent ? ' fail' : '';
  const intro = (
    <div className={classes}>
      <Activation
        email={id}
        activated={activated}
        activateFail={!activated}
        onResent={success => {
          setResent(success);
        }}
      />
    </div>
  );

  useEffect(() => {
    activate(id, activateToken)
      .then(res => {
        if (res.status === 'success') {
          setActivated(true);
          setFirstRender(false);
        } else throw res.data;
      })
      .catch(err => {
        setActivated(false);
        setFirstRender(false);
      });
  }, []);

  return firstRender ? '' : <Landing intro={intro} short={true} />;
}

export default ActivationResult;
