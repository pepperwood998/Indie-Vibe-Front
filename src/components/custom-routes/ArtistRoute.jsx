import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext, MeContext } from '../../contexts';

function ArtistRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;

  return (
    <Route
      {...rest}
      render={props => {
        if (state.token) {
          if (role.id === 'r-artist') return <Component {...props} />;
          else
            return (
              <Redirect
                to={{
                  pathname: '/player/home',
                  state: props.location
                }}
              />
            );
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: props.location
              }}
            />
          );
        }
      }}
    />
  );
}

export default ArtistRoute;
