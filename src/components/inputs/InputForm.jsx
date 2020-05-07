import React from 'react';

function InputForm({
  type = 'text',
  placeholder = 'Enter something',
  onChange = () => {},
  error = false,
  errMessage = '',
  value = '',
  name = '',
  autocomplete = 'on',
  min = 0,
  max = 0
}) {
  let classes =
    'input-text input-text--clear input-text--full-width font-white';
  if (error) {
    classes = error ? (classes += ' input-text--error') : classes;
    placeholder = errMessage;
  }

  return type === 'number' ? (
    <input
      className={classes}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      autoComplete={autocomplete}
      min={min}
      max={max}
    />
  ) : (
    <input
      className={classes}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      autoComplete={autocomplete}
    />
  );
}

export default InputForm;
