import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts';

function GuestRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (!state.token) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/home',
                state: props.location
              }}
            />
          );
        }
      }}
    />
  );
}

export default GuestRoute;
