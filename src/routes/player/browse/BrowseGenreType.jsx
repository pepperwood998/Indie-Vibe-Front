import React, { useContext, useEffect, useState } from 'react';
import { browseGenreType } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import GroupEmpty from '../../../components/groups/GroupEmpty';
import { ButtonLoadMore } from '../../../components/buttons';

function BrowseGenreType(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    genre: {},
    data: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    }
  });

  const { id, type } = props.match.params;
  const isPlaylist = type === 'playlists';
  const src = data.data;

  // effect: init
  useEffect(() => {
    browseGenreType(authState.token, id, type)
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

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    const items = [...src.items];

    items.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });

    setData({
      ...data,
      data: {
        ...src,
        items
      }
    });
  }, [libState.ctxFav]);

  const handleLoadMore = () => {
    browseGenreType(authState.token, id, type, src.offset + src.limit)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const dataPart = res.data.data;

          setData({
            ...data,
            data: {
              ...src,
              ...dataPart,
              items: [...src.items, ...dataPart.items]
            }
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  };

  return firstRender ? (
    ''
  ) : (
    <div className='browse-genre-type content-page fadein d-flex flex-column'>
      <div className='page-banner'>
        <span className='font-short-extra font-weight-bold font-white'>
          {data.genre.name}
        </span>
      </div>

      <GroupEmpty isEmpty={!src.items.length} message={`No available ${type}`}>
        <div className='genre-content mono-page content-padding flex-1'>
          <CollectionMain
            header={isPlaylist ? "Editor's curated" : 'New releases'}
            items={src.items}
          />
          {src.total > src.offset + src.limit ? (
            <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
          ) : (
            ''
          )}
        </div>
      </GroupEmpty>
    </div>
  );
}

export default BrowseGenreType;
