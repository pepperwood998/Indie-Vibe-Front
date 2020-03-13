import React from 'react';
import { NavLink } from 'react-router-dom';

function LinkWhiteColor(props) {
  let classes = ['link-bright-gray', props.className].join(' ');
  if (props.active) {
    classes += ' active';
  }

  let { href, nav } = props;

  if (href) {
    if (nav) {
      return (
        <NavLink to={href} className={classes}>
          {props.children}
        </NavLink>
      );
    } else {
      return (
        <a href={href} className={classes}>
          {props.children}
        </a>
      );
    }
  } else {
    return (
      <span className={classes} onClick={props.onClick}>
        {props.children}
      </span>
    );
  }
}

export default LinkWhiteColor;
