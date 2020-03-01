import React from 'react';

import './style.scss';

function Authentication(props) {
  return (
    <div className='page-authen'>
      <div className='page-authen__banner'>
        <div className='logo'>
          {props.logo}
        </div>
      </div>
      <div className='page-authen__body'>
        <div className='page-authen__body__layer'>
          <div className='form-authen'>
            <div className='form-authen__input'>{props.inputs}</div>
            <div className='form-authen__submit'>{props.submits}</div>
          </div>
          <div className='box-addition'>{props.addition}</div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
