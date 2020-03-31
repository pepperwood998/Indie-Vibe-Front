import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext, MeContext } from '../../contexts';

function PremiumRoute({ component: Component, ...rest }) {
  const { state: authState } = useContext(AuthContext);
  const { state: meState } = useContext(MeContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (!authState.token) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: props.location
              }}
            />
          );
        } else {
          if (meState.role.id === 'r-free') {
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
