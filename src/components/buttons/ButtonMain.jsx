import React from 'react';

function ButtonMain({ label = 'Enter', isFitted = true, onClick = () => {} }) {
  let classes = 'button button-main font-white font-short-b';
  if (isFitted) {
    classes += ' button--fit';
  }

  return (
    <div className={classes} onClick={onClick}>
      {label}
    </div>
  );
}

export default ButtonMain;
