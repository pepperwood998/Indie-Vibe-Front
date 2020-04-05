import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { AuthContext, MeContext } from '../../contexts';

function CMSRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;

  return (
    <Route
      {...rest}
      render={props => {
        if (state.token && role.id === 'r-admin') {
          return <Component {...props} {...rest} />;
        } else {
          window.location.href = '/cms-login';
          return '';
        }
      }}
    />
  );
}

export default CMSRoute;
