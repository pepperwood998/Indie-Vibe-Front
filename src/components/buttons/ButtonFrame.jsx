import React from 'react';

function ButtonFrame({ label = 'Enter', isFitted = true, onClick = () => {} }) {
  let classes = 'button button-frame font-white font-regular';
  if (isFitted) {
    classes += ' button--fit';
  }

  return (
    <div className={classes} onClick={onClick}>
      {label}
    </div>
  );
}

export default ButtonFrame;
