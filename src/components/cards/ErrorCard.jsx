import React from 'react';

function ErrorCard({ message = 'Error' }) {
  return <div className='card-error font-regular'>{message}</div>;
}

export default ErrorCard;
