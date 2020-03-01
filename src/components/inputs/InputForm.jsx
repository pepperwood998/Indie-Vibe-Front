import React from 'react';

function InputForm({
  type = 'text',
  placeholder = 'Enter something',
  onChange = () => {}
}) {
  return (
    <input
      className='input-main input-full font-white'
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export default InputForm;
