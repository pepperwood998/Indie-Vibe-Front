import React from 'react';

function RequestDetails(props) {
  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-request-details'>
        <section className='release-box'>
          <div className='info'>
            <div className='thumbnail-wrapper'>
              <img className='thumbnail' src='' />
            </div>
            <div className='title-wrapper'>
              <span className='title'></span>
            </div>
          </div>
          <div className='content'>
            <div className='tracks'></div>
            <div className='actions'></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RequestDetails;
