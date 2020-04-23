import React from 'react';
import Loading from '../../assets/imgs/loading.gif';

function ButtonMain({
  className = '',
  full = false,
  disabled = false,
  onClick = () => undefined,
  revert = false,
  children,
  type = 'button'
}) {
  let classes =
    'button button-main font-white font-short-regular font-weight-bold';
  classes += className ? ` ${className}` : '';
  classes += full ? ' full' : '';
  classes += disabled ? ' disabled' : '';
  classes += revert ? ' revert' : '';

  return (
    <button className={classes} onClick={onClick} type={type}>
      {disabled ? <img src={Loading} width='15px' height='15px' /> : children}
    </button>
  );
}

export default ButtonMain;
