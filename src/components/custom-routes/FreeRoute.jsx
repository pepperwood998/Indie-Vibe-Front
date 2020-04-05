import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext, MeContext } from '../../contexts';

function FreeRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;

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
          if (role.id !== 'r-free') {
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
