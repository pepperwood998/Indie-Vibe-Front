import React from 'react';

import { InputSearch } from '../../components/inputs';
import { ArrowBack, ArrowForward } from '../../assets/svgs';

function Top(props) {
  let { history } = props;
  let searchTimeout;

  return (
    <div className='nav-search'>
      <InputSearch
        onChange={e => {
          e.persist();
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            if (e.target.value)
              history.push(`/player/search/${e.target.value}`);
          }, 300);
        }}
      />
      <div className='linear-nav'>
        <ArrowBack
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            history.goBack();
          }}
        />
        <ArrowForward
          className='svg--small svg--cursor svg--bright'
          onClick={() => {
            history.goForward();
          }}
        />
      </div>
    </div>
  );
}

export default Top;
