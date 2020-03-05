import React from 'react';

function ButtonFrame(props) {
  let classes = [
    'button button-frame font-white font-short-regular font-weight-bold',
    props.className
  ].join(' ');
  if (props.isFitted) {
    classes += ' button--fit';
  }

  return (
    <div className={classes} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export default ButtonFrame;
