import React from 'react';

function ButtonIcon(props) {
  return (
    <div className='button-icon' onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export default ButtonIcon;
