import React from 'react';

function LinkUnderline(props) {
  let classes = ['link-underline', props.className].join(' ');
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
      <div className={classes} onClick={props.onClick}>
        {props.children}
      </div>
    );
  }
}

export default LinkUnderline;
