import React from 'react';

function ButtonMain({
  className = '',
  full = false,
  disabled = false,
  onClick = () => undefined,
  children,
  type = 'button'
}) {
  let classes =
    'button button-main font-white font-short-regular font-weight-bold';
  classes += className ? ` ${className}` : '';
  classes += full ? ' full' : '';
  classes += disabled ? ' disabled' : '';

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export default ButtonMain;
