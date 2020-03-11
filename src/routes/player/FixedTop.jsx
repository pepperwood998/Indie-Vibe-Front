import React from 'react';

import SearchInput from '../../components/inputs/SearchInput';
import { ArrowBack, ArrowForward } from '../../assets/svgs';

function Top() {
  return (
    <div className='nav-search'>
      <SearchInput />
      <div className='linear-nav'>
        <ArrowBack className='svg-nav'/>
        <ArrowForward className='svg-nav'/>
      </div>
    </div>
  );
}

export default Top;
