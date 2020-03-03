import React from 'react';

function ErrorCard({ message = 'Error' }) {
  return <div className='card-error font-short-b'>{message}</div>;
}

export default ErrorCard;
