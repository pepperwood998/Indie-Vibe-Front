import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts';

function UserRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (state.token) {
          return <Component {...props} {...rest} />;
        } else {
          window.location.href = '/login';
          return '';
        }
      }}
    />
  );
}

export default UserRoute;
