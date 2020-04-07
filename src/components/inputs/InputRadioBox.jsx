import React from 'react';

function InputRadioBox({
  name = 'radio',
  value = 'female',
  label = 'Label',
  onChange = () => {},
  checked,
  className = ''
}) {
  let classes = 'ticker-main font-tall-r font-white';
  if (className) classes += ` ${className}`;

  return (
    <label className={classes}>
      <span>{label}</span>
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
