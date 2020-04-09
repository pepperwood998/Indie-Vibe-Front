import React from 'react';

function Revenue(props) {
  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-revenue padder'>
        <section className='annual boxy catalog-menu'>
          <div className='header'>
            <span className='font-short-semi font-weight-bold'>
              Annual Revenue
            </span>
          </div>
          <div></div>
        </section>
        <section className='monthly boxy catalog-menu'>
          <div className='header'>
            <span className='font-short-semi font-weight-bold'>
              Revenue by Month
            </span>
          </div>
          <div></div>
        </section>
      </div>
    </div>
  );
}

export default Revenue;
