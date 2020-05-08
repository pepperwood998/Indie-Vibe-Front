import React from 'react';
import InputTextarea from './InputTextarea';

function TextLimit({
  placeholder = '',
  value = '',
  onChange = e => {},
  error = false,
  errMessage = '',
  length = 0,
  limit = 0,
  className = '',
  light = true
}) {
  let txtClasses = 'float-right font-short-regular';
  if (length >= limit) txtClasses += ' font-red';
  else if (light) txtClasses += ' font-white';

  return (
    <div className={className}>
      <InputTextarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        errMessage={errMessage}
      />
      <div className='clearfix'>
        <span className={txtClasses}>
          {length}/{limit}
        </span>
      </div>
    </div>
  );
}

export default TextLimit;
