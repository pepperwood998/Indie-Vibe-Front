import React from 'react';

function InputTextarea({
  type = 'text',
  placeholder = 'Enter something',
  onChange = () => {},
  error = false,
  errMessage = '',
  value = '',
  name = '',
  disabled = false
}) {
  let classes = 'input-text input-text--full';
  if (error) {
    classes = error ? (classes += ' input-text--error') : classes;
    placeholder = errMessage;
  }

  return (
    <textarea
      rows='4'
      className={classes}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
}

export default InputTextarea;
