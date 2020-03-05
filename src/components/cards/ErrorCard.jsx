import React from 'react';

function ErrorCard({ message = 'Error' }) {
  return <div className='card-error font-short-regular font-weight-bold'>{message}</div>;
}

export default ErrorCard;
