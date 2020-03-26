import React, { useState, useEffect, useContext } from 'react';
import { CollectionMain } from '../../../components/collections';
import { ButtonLoadMore } from '../../../components/buttons';
import { getReleasesByType } from '../../../apis/API';
import { AuthContext } from '../../../contexts';
import GroupEmpty from '../../../components/groups/GroupEmpty';

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
  const isEmpty =
    !albums.items.length && !singles.items.length && !eps.items.length;

  useEffect(() => {
    for (let type in struct) {
      getReleasesByType(authState.token, artistId, type)
        .then(res => {
          setFirstRender(firstRender => firstRender + 1);
          if (res.status === 'success' && res.data) {
            const value = struct[type];
            value[2]({ ...value[1], ...res.data });
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
    <GroupEmpty isEmpty={isEmpty} message='No public releases available'>
      <div className='artist-default fadein content-padding'>
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
      </div>
    </GroupEmpty>
  );
}

export default ArtistDefault;
