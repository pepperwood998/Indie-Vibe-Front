import React from 'react';

function RadioBox({
  name = 'radio',
  value = 'female',
  label = 'Label',
  onChange = () => {}
}) {
  return (
    <label className='ticker-main font-tall-r font-weight-bold font-white '>
      {label}
      <input type='radio' name={name} value={value} onChange={onChange} />
      <span className='checkmark checkmark-point'></span>
    </label>
  );
}

export default RadioBox;
