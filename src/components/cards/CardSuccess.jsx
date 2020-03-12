import React from 'react';

function CardSuccess({ message = 'Error' }) {
  return <div className='card-success font-short-regular font-weight-bold'>{message}</div>;
}

export default CardSuccess;
