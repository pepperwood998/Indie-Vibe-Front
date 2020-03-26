import React from 'react';

function GroupEmpty(props) {
  return props.isEmpty ? (
    <div className='empty fadein'>{props.message}</div>
  ) : (
    props.children
  );
}

export default GroupEmpty;
