import React from 'react';
import { TableArtistRequests } from '../components/tables';

function Requests(props) {
  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-requests fadein'>
        <section className='requests-box'>
          <div className='banner'>
            <span className='title font-short-semi font-weight-bold font-white'>
              User with pending artist request
            </span>
          </div>
          <div className='content'>
            <TableArtistRequests withActions={true} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Requests;
