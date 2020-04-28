import React from 'react';

function GroupProgressDialog({ progress = 0, message = '' }) {
  return (
    <div className='screen-overlay adding d-flex flex-column justify-content-center align-items-center'>
      <span className='font-short-extra font-weight-bold font-white'>
        {message} {Math.round(progress)}%
      </span>
      <div className='progress-box mt-2'>
        <div className='progress' style={{ width: progress + '%' }}></div>
      </div>
    </div>
  );
}

export default GroupProgressDialog;
