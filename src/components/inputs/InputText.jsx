import React from 'react';

function InputText({
  type = 'text',
  placeholder = 'Enter something',
  onChange = () => {},
  error = false,
  errMessage = '',
  value = '',
  name = ''
}) {
  let classes = 'input-text input-text--full';
  if (error) {
    classes = error ? (classes += ' input-text--error') : classes;
    placeholder = errMessage;
  }

  return (
    <input
      className={classes}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
}

export default InputText;
