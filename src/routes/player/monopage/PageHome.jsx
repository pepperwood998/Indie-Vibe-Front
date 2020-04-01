import React, { useContext, useEffect, useState } from 'react';
import { getHome } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { AuthContext } from '../../../contexts';

function Home() {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    recent: [],
    most: [],
    newReleases: [],
    popularReleases: [],
    myPlaylists: [],
    myArtists: []
  });

  const struct = {
    recent: 'Recently played',
    most: 'Your heavy rotation',
    newReleases: 'New publised releases',
    myPlaylists: 'Your created playlists',
    popularReleases: 'Popular release',
    myArtists: 'Your favorite artists'
  };

  useEffect(() => {
    getHome(authState.token)
      .then(res => {
        setFirstRender(false);
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

  return firstRender ? (
    ''
  ) : (
    <div className='content-page fadein'>
      <div className='page-banner'>
        <span className='font-short-extra font-weight-bold font-white'>
          Home
        </span>
      </div>
      <div className='home-page mono-page content-padding'>
        {Object.keys(struct).map((key, index) => {
          const items = data[key];
          if (!items.length) return '';

          return (
            <CollectionMain
              header={struct[key]}
              items={items}
              full={true}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
