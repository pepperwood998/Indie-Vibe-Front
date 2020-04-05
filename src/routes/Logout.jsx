import React, { useContext, useEffect } from 'react';
import { AuthContext, MeContext } from '../contexts';

function Logout(props) {
  const { actions: authAction, dispatch: authDispatch } = useContext(
    AuthContext
  );
  const { actions: meActions, dispatch: meDispatch } = useContext(MeContext);

  useEffect(() => {
    authDispatch(authAction.logout());
    meDispatch(meActions.unloadMe());
  }, []);

  return <span className='font-short-big pl-1'>Signing out...</span>;
}

export default Logout;
