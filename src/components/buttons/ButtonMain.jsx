import React from 'react';

function ButtonMain(props) {
  let classes = [
    'button button-main font-white font-short-regular font-weight-bold',
    props.className
  ].join(' ');
  if (props.isFitted) {
    classes += ' button--fit';
  }
  if (props.disabled) {
    classes += ' disabled';
  }

  return (
    <div className={classes} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export default ButtonMain;
