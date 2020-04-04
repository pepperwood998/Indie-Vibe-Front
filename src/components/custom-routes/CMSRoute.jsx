import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../../contexts';

function CMSRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (state.token && state.role === 'r-admin') {
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
