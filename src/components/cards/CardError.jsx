import React from 'react';

function CardError(props) {
  let classes = [
    'card-error font-short-regular font-weight-bold',
    props.className
  ].join(' ');

  return (
    <div className={classes}>
      {props.message}
    </div>
  );
}

export default CardError;
