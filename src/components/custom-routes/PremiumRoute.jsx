import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext, MeContext } from '../../contexts';

function PremiumRoute({ component: Component, ...rest }) {
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
          if (state.role === 'r-free') {
            return (
              <Redirect
                to={{
                  pathname: '/player/home',
                  state: props.location
                }}
              />
            );
          }

          return <Component {...props} {...rest} />;
        }
      }}
    />
  );
}

export default PremiumRoute;
