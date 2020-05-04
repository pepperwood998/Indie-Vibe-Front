import React, { useContext, useEffect, useState } from 'react';
import { getHome } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { usePageTitle } from '../../../components/hooks';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import TemplateBannerPage from '../template/TemplateBannerPage';

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
    newReleases: 'New published releases'
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

  usePageTitle('Home', true);

  // effect-skip: favorite
  useEffectSkip(() => {
    let mapper = {};
    const { ctxFav } = libState;

    Object.keys(data).some(key => {
      const collection = [...data[key]];
      let existed = collection.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });

      if (existed) mapper[key] = [...collection];
    });

    setData({ ...data, ...mapper });
  }, [libState.ctxFav]);

  return (
    <TemplateBannerPage
      title='Home'
      body={
        <div className='home-page content-padding flex-1'>
          {firstRender ? (
            <CollectionMain loading />
          ) : (
            Object.keys(struct).map((key, index) => {
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
            })
          )}
        </div>
      }
    />
  );
}

export default Home;
