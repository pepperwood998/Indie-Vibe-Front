import React from 'react';

function ButtonRegular({
  type = 'button',
  onClick = () => undefined,
  disabled = false,
  children
}) {
  var classes = 'btn-regular';
  if (disabled) {
    classes += ' disabled';
  } else {
    classes += ' active';
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default ButtonRegular;
