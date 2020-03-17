import React from 'react';

function ButtonLoadMore(props) {
  return (
    <div
      className='button button-load-more font-short-s link-bright-gray'
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export default ButtonLoadMore;
