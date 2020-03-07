import React from 'react';

function LinkWhiteColor(props) {
  let classes = ['link-blue-main', props.className].join(' ');
  if (props.active) {
    classes += ' active';
  }

  if (props.href) {
    return (
      <a href={props.href} className={classes}>
        {props.children}
      </a>
    );
  } else {
    return (
      <span className={classes} onClick={props.onClick}>
        {props.children}
      </span>
    );
  }
}

export default LinkWhiteColor;
