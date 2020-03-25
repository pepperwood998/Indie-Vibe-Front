import React from 'react';

function InputRadioBox({
  name = 'radio',
  value = 'female',
  label = 'Label',
  onChange = () => {},
  checked
}) {
  return (
    <label className='ticker-main font-tall-r font-weight-bold font-white '>
      {label}
      <input
        type='radio'
        className='input-custom'
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <span className='checkmark checkmark-point'></span>
    </label>
  );
}

export default InputRadioBox;
