import React from 'react';

import { InputSearch } from '../../components/inputs';
import { ArrowBack, ArrowForward } from '../../assets/svgs';

function Top() {
  return (
    <div className='nav-search'>
      <InputSearch />
      <div className='linear-nav'>
        <ArrowBack className='svg-nav' />
        <ArrowForward className='svg-nav' />
      </div>
    </div>
  );
}

export default Top;
