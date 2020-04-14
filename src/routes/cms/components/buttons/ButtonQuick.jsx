import React from 'react';

function ButtonQuick({
  type = 'regular',
  className = '',
  children,
  disabled = false,
  onClick = () => undefined
}) {
  let classes = 'btn-quick';
  classes += ` ${type}`;
  classes += className ? ` ${className}` : '';

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default ButtonQuick;
