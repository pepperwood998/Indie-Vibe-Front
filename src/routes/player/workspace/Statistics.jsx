import React from 'react';
import StatisticRelease from './StatisticRelease';
import StatisticTotal from './StatisticTotal';
import StatisticTrack from './StatisticTrack';

function Statistics(props) {
  return (
    <div className='workspace-statistics fadein content-padding'>
      <div className='body__bound'>
        <section className='section total catalog'>
          <div className='catalog__header'>
            <h3 className='font-short-extra font-weight-bold font-white'>
              Monthly stream time
            </h3>
          </div>
          <div className='catalog__body'>
            <StatisticTotal />
          </div>
        </section>
        <section className='section release'>
          <div className='catalog__header'>
            <h3 className='font-short-semi font-weight-bold font-white'>
              Releases stream
            </h3>
          </div>
          <div className='catalog__body'>
            <StatisticRelease />
          </div>
        </section>
        <section className='section track'>
          <div className='catalog__header'>
            <h3 className='font-short-semi font-weight-bold font-white'>
              Tracks stream
            </h3>
          </div>
          <div className='catalog__body'>
            <StatisticTrack />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Statistics;
