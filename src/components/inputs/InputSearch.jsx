import React from 'react';

import { SearchIcon } from '../../assets/svgs';

function InputSearch({ placeholder = 'Search', onChange = () => {} }) {
  const handleSearch = e => {
    if (e.key === 'Enter') {
      onChange(e);
    }
  };

  return (
    <div className='input-search'>
      <SearchIcon />
      <input
        type='search'
        className='font-white font-short-s'
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={handleSearch}
        autoComplete='new-password'
      />
    </div>
  );
}

export default InputSearch;
