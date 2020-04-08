import React, { useContext, useEffect, useState } from 'react';
import { getHome } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';

function Home() {
  const { state: libState } = useContext(LibraryContext);
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    recent: [],
    most: [],
    popularReleases: [],
    myPlaylists: [],
    myArtists: [],
    newReleases: []
  });

  const struct = {
    recent: 'Recently played',
    most: 'Your heavy rotation',
    popularReleases: 'Popular release',
    myPlaylists: 'Your created playlists',
    myArtists: 'Your favorite artists',
    newReleases: 'New publised releases'
  };

  useEffect(() => {
    getHome(authState.token)
      .then(res => {
        console.log(res.data);
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

  useEffectSkip(() => {
    Object.keys(data).some(key => {
      //
    });
  }, [libState.ctxFav]);

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
