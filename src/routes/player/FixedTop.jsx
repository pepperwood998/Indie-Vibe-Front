import React from 'react';
import { ArrowBack, ArrowForward, LogoIcon } from '../../assets/svgs';
import { InputSearch } from '../../components/inputs';
import Tooltip from '../../components/tooltips/Tooltip';

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
      <section>
        <a href='/home'>
          <LogoIcon />
        </a>
      </section>
      <section className='linear-nav'>
        <Tooltip tooltip='Go back' pos='bottom'>
          <ArrowBack
            className='svg--small svg--cursor svg--bright'
            onClick={() => {
              history.goBack();
            }}
          />
        </Tooltip>
        <Tooltip tooltip='Go forward' pos='bottom'>
          <ArrowForward
            className='svg--small svg--cursor svg--bright'
            onClick={() => {
              history.goForward();
            }}
          />
        </Tooltip>
      </section>
    </div>
  );
}

export default Top;
