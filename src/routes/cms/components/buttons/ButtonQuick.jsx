import React from 'react';

function ButtonQuick({
  type = 'regular',
  className = '',
  children,
  onClick = () => undefined
}) {
  let classes = 'btn-quick';
  classes += ` ${type}`;
  classes += className ? ` ${className}` : '';

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export default ButtonQuick;
