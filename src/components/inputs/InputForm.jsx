import React from 'react';

function InputForm({
  type = 'text',
  placeholder = 'Enter something',
  onChange = () => {},
  error = false,
  errMessage = '',
  value = '',
  name = ''
}) {
  let classes = 'input-main input-full font-white';
  if (error) {
    classes = error ? (classes += ' input-error') : classes;
    placeholder = errMessage;
  };

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

export default InputForm;
