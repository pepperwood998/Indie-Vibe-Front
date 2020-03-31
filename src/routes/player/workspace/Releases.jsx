import React, { useContext, useEffect, useState } from 'react';
import { getReleasesByType } from '../../../apis/API';
import { ButtonLoadMore } from '../../../components/buttons';
import { CollectionMain } from '../../../components/collections';
import { AuthContext } from '../../../contexts';
import GroupEmpty from '../../../components/groups/GroupEmpty';

const model = {
  items: [],
  offset: 0,
  limit: 0,
  total: 0
};
function Releases(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(0);
  const [albums, setAlbums] = useState({ ...model });
  const [singles, setSingles] = useState({ ...model });
  const [eps, setEps] = useState({ ...model });

  const { id } = authState;
  const struct = {
    're-album': ['Albums', albums, setAlbums],
    're-single': ['Singles', singles, setSingles],
    're-eps': ['EPs', eps, setEps]
  };
  const isEmpty =
    !albums.items.length && !singles.items.length && !eps.items.length;

  useEffect(() => {
    for (let type in struct) {
      getReleasesByType(authState.token, id, type)
        .then(res => {
          setFirstRender(firstRender => firstRender + 1);
          if (res.status === 'success' && res.data) {
            const value = struct[type];
            value[2]({ ...value[1], ...res.data.releases });
          } else {
            throw 'Error';
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [id]);

  const handleLoadMore = type => {
    const value = struct[type];

    getReleasesByType(
      authState.token,
      id,
      type,
      value[1].offset + value[1].limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          const { releases } = res.data;
          value[2]({
            ...value[1],
            items: [...value[1].items, ...releases.items],
            offset: releases.offset,
            limit: releases.limit,
            total: releases.total
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
    <GroupEmpty isEmpty={isEmpty} message='You have no releases.'>
      <div className='workspace-releases fadein content-padding'>
        {Object.keys(struct).map((key, index) => {
          const value = struct[key];
          if (value[1].items.length <= 0) return '';

          return (
            <section key={index}>
              <CollectionMain
                header={value[0]}
                items={value[1].items}
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

export default Releases;
