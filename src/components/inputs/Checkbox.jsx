import React from 'react';

function Checkbox({ label = 'Label', onChange = () => {} }) {
  return (
    <label className='ticker-main font-tall-b font-white '>
      {label}
      <input type='checkbox' onChange={onChange} />
      <span className='checkmark checkmark-tick'></span>
    </label>
  );
}

export default Checkbox;
