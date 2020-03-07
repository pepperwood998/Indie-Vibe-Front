import React from 'react';

function SuccessCard({ message = 'Error' }) {
  return <div className='card-success font-short-regular font-weight-bold'>{message}</div>;
}

export default SuccessCard;
