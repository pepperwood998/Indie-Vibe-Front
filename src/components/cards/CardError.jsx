import React from 'react';

function CardError({ message = 'Error' }) {
  return <div className='card-error font-short-regular font-weight-bold'>{message}</div>;
}

export default CardError;
