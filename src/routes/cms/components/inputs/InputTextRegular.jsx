import React from 'react';

function InputTextRegular({
  type = 'text',
  name = '',
  value = '',
  placeholder = '',
  error = false,
  errMessage = '',
  onChange = e => undefined
}) {
  let classes = 'input-text-regular';
  if (error) {
    placeholder = errMessage;
    classes += ' error';
  }

  return (
    <input
      className={classes}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export default InputTextRegular;
