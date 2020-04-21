import React from 'react';
import { CloseIcon, SearchIcon } from '../../assets/svgs';

function InputSearch({
  placeholder = 'Search',
  onChange = () => {},
  onEmpty = () => {},
  value = ''
}) {
  const handleSearch = e => {
    if (e.key === 'Enter') {
      onChange(e);
    }
  };

  return (
    <div className='input-search'>
      {value ? (
        <CloseIcon className='svg--cursor svg--small' onClick={onEmpty} />
      ) : (
        <SearchIcon />
      )}
      <input
        type='text'
        className='font-white font-short-big'
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={handleSearch}
        autoComplete='new-password'
        value={value}
      />
    </div>
  );
}

export default InputSearch;
