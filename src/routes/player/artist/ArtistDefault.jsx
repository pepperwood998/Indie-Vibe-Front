import React, { useState, useEffect, useContext } from 'react';
import { CollectionMain } from '../../../components/collections';
import { ButtonLoadMore } from '../../../components/buttons';
import { getReleasesByType } from '../../../apis/API';
import { AuthContext } from '../../../contexts';

const model = {
  items: [],
  offset: 0,
  limit: 0,
  total: 0
};
function ArtistDefault(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(0);
  const [albums, setAlbums] = useState({ ...model });
  const [singles, setSingles] = useState({ ...model });
  const [eps, setEps] = useState({ ...model });

  const { id: artistId } = props.match.params;
  const struct = {
    're-album': ['Albums', albums, setAlbums],
    're-single': ['Singles', singles, setSingles],
    're-eps': ['EPs', eps, setEps]
  };

  useEffect(() => {
    for (let type in struct) {
      getReleasesByType(authState.token, artistId, type)
        .then(res => {
          if (res.status === 'success' && res.data) {
            const value = struct[type];
            value[2]({ ...value[1], ...res.data });
            setFirstRender(firstRender => firstRender + 1);
          } else {
            throw 'Error';
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [artistId]);

  const handleLoadMore = type => {
    const value = struct[type];

    getReleasesByType(
      authState.token,
      artistId,
      type,
      value[1].offset + value[1].limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          value[2]({
            ...value[1],
            items: [...value[1].items, ...res.data.items],
            offset: res.data.offset,
            limit: res.data.limit,
            total: res.data.total
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return firstRender < 3 ? (
    ''
  ) : (
    <div className='artist-default content-page fadein'>
      {albums.total <= 0 && singles.total <= 0 && eps.total <= 0 ? (
        <span className='font-short-extra font-weight-bold font-white'>
          No public releases.
        </span>
      ) : (
        <React.Fragment>
          {Object.keys(struct).map((key, index) => {
            const value = struct[key];
            if (value[1].items.length <= 0) return '';

            return (
              <section key={index}>
                <CollectionMain
                  header={value[0]}
                  items={value[1].items}
                  type='release'
                  full={true}
                />
                {value[1].total > value[1].offset + value[1].limit ? (
                  <ButtonLoadMore
                    onClick={() => {
                      handleLoadMore(key);
                    }}
                  >
                    Load more
                  </ButtonLoadMore>
                ) : (
                  ''
                )}
              </section>
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
}

export default ArtistDefault;
