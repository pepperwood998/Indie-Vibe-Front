import React from 'react';

import { SearchIcon } from '../../assets/svgs';

function InputSearch({ placeholder = 'Search', onChange = () => {} }) {
  return (
    <div className='input-search'>
      <SearchIcon />
      <form>
        <input
          type='search'
          className='font-white font-short-s'
          placeholder={placeholder}
          onChange={onChange}
          autoComplete='new-password'
        />
      </form>
    </div>
  );
}

export default InputSearch;
