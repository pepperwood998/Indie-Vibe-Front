import React from 'react';

import { NavLink } from 'react-router-dom';

function NavLinkColor(props) {
  let classes = ['link-blue-main', props.className].join(' ');

  return (
    <NavLink to={props.href} className={classes}>
      {props.children}
    </NavLink>
  );
}

export default NavLinkColor;
