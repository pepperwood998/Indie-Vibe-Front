import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { AuthContext } from '../../contexts';

function RouteAuthorized({
  component: Component,
  path,
  roleGroup = {},
  ...rest
}) {
  const { state: authState } = useContext(AuthContext);

  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        if (
          !roleGroup.roles.length ||
          roleGroup.roles.includes(authState.role)
        ) {
          return <Component {...props} {...rest} />;
        } else {
          window.location.href = roleGroup.redirect;
          return '';
        }
      }}
    />
  );
}

export default RouteAuthorized;
