import React from 'react';
import { LineMulBlack } from '../../../components/charts';
import { createYearOptions } from '../../../utils/Common';

function Revenue(props) {
  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-revenue padder'>
        <section className='annual boxy catalog-menu'>
          <RevenueAnnual />
        </section>
        <section className='monthly boxy catalog-menu'>
          <div className='header'>
            <span className='font-short-semi font-weight-bold'>
              Revenue by Months
            </span>
          </div>
          <div></div>
        </section>
      </div>
    </div>
  );
}

function RevenueAnnual() {
  return (
    <React.Fragment>
      <div className='header'>
        <span className='font-short-semi font-weight-bold'>Annual Revenue</span>
      </div>
      <div className='content'>
        <div className='d-flex align-items-center pb-3'>
          <div>
            <label htmlFor='annual' className='pr-2'>
              Select year
            </label>
          </div>
          <select
            id='annual'
            name='year'
            value={{}}
            className='custom-select'
            onChange={{}}
          >
            {createYearOptions()}
          </select>
        </div>
        <div className='d-flex'>
          <div className='flex-1'>
            <LineMulBlack title='Revenue by Years' />
          </div>
          <div className='flex-1 pl-2'></div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Revenue;
