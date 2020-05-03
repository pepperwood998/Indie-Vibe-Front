import React from 'react';

function InputTextRegular({
  type = 'text',
  name = '',
  value = '',
  placeholder = '',
  error = false,
  errMessage = '',
  onChange = e => undefined,
  area = false
}) {
  let classes = 'input-text-regular';
  if (error) {
    placeholder = errMessage;
    classes += ' error';
  }

  return area ? (
    <textarea
      rows='4'
      className={classes}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  ) : (
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
