import React from 'react';
import { CardMain } from '../../../components/cards';

function Home() {
  return (
    <div className='content-page home-page'>
      <div className='mono-page'>
        <div className='group-main group-main--extended'>
          <div className='group-main__header'>
            <div className='font-short-extra font-white font-weight-bold'>
              Your heavy rotation
            </div>
          </div>
          <div className='group-main__content'>
            <CardMain className='item' />
            <CardMain className='item' />
            <CardMain className='item' />
            <CardMain className='item' />
            {/* <CardMain className='item' /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
