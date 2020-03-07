import React from 'react';

import { NavLink } from 'react-router-dom';

function NavLinkUnderline(props) {
  let classes = ['link-underline', props.className].join(' ');

  return (
    <NavLink to={props.href} className={classes}>
      {props.children}
    </NavLink>
  );
}

export default NavLinkUnderline;
