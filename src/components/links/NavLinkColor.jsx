import React from 'react';

import { NavLink } from 'react-router-dom';

function NavLinkColor(props) {
  let classes = ['link-blue-main', props.className].join(' ');

  if (Array.isArray(props.href)) {
    return (
      <NavLink
        to={props.href[0]}
        className={classes}
        isActive={(match, location) => {
          const { pathname } = location;
          return (
            props.href.includes(pathname) ||
            (!props.shallow &&
              props.href.some(path => pathname.indexOf(path) >= 0))
          );
        }}
      >
        {props.children}
      </NavLink>
    );
  }
  return (
    <NavLink to={props.href} className={classes}>
      {props.children}
    </NavLink>
  );
}

export default NavLinkColor;
