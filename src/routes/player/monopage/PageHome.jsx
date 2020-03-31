import React, { useContext, useEffect, useState } from 'react';
import { getHome } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { AuthContext } from '../../../contexts';

function Home() {
  const { state: authState } = useContext(AuthContext);

  const [data, setData] = useState({
    recent: [],
    most: [],
    newReleases: [],
    popularReleases: [],
    myPlaylists: []
  });

  useEffect(() => {
    getHome(authState.token)
      .then(res => {
        if (res.status === 'success') {
          setData({ ...data, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className='content-page fadein'>
      <div className='page-banner'>
        <span className='font-short-extra font-weight-bold font-white'>
          Home
        </span>
      </div>
      <div className='home-page mono-page content-padding'>
        {!data.recent.length ? (
          ''
        ) : (
          <CollectionMain header='Recent played' items={data.recent} />
        )}
        {!data.most.length ? (
          ''
        ) : (
          <CollectionMain header='Your heavy rotation' items={data.most} />
        )}
        {!data.newReleases.length ? (
          ''
        ) : (
          <CollectionMain header='New releases' items={data.newReleases} />
        )}
        {!data.popularReleases.length ? (
          ''
        ) : (
          <CollectionMain
            header='Popular releases'
            items={data.popularReleases}
          />
        )}
        {!data.myPlaylists.length ? (
          ''
        ) : (
          <CollectionMain header='Your playlists' items={data.myPlaylists} />
        )}
      </div>
    </div>
  );
}

export default Home;
