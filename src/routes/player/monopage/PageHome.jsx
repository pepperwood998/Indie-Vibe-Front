import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../contexts';

function Home() {
  const { state: authState } = useContext(AuthContext);

  const [data, setData] = useState({
    recent: [],
    most: [],
    newReleases: [],
    popularReleases: []
  });

  return (
    <div className='content-page fadein'>
      <div className='page-banner'>
        <span className='font-short-extra font-weight-bold font-white'>
          Home
        </span>
      </div>
      <div className='home-page mono-page content-padding'>
      </div>
    </div>
  );
}

export default Home;
