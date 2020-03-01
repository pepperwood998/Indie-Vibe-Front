import React from 'react';

function ButtonFacebook({
  label = 'Enter',
  isFitted = true,
  onClick = () => {}
}) {
  let classes = 'button button-fb font-white font-short-b';
  if (isFitted) {
    classes += ' button--fit';
  }

  return (
    <div className={classes} onClick={onClick}>
      {label}
    </div>
  );
}

export default ButtonFacebook;
