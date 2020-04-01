import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts';

function FreeRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (!state.token) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: props.location
              }}
            />
          );
        } else {
          if (state.role !== 'r-free') {
            return (
              <Redirect
                to={{
                  pathname: '/player/account',
                  state: props.location
                }}
              />
            );
          } else {
            return <Component {...props} {...rest} />;
          }
        }
      }}
    />
  );
}

export default FreeRoute;
