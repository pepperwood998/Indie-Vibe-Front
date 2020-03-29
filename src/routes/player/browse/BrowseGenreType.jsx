import React, { useContext, useEffect, useState } from 'react';
import { browseGenreType } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import GroupEmpty from '../../../components/groups/GroupEmpty';

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
    const items = [...data.data.items];

    items.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });

    setData({
      ...data,
      data: {
        ...data.data,
        items
      }
    });
  }, [libState.ctxFav]);

  return firstRender ? (
    ''
  ) : (
    <div className='browse-genre-type content-page fadein'>
      <div className='page-banner'>
        <span className='font-short-extra font-weight-bold font-white'>
          {data.genre.name}
        </span>
      </div>

      <GroupEmpty
        isEmpty={!data.data.items.length}
        message={`No available ${type}`}
      >
        <div className='genre-content mono-page content-padding'>
          <CollectionMain
            header={isPlaylist ? "Editor's curated" : 'New releases'}
            items={data.data.items}
            type={isPlaylist ? 'playlist' : 'release'}
          />
        </div>
      </GroupEmpty>
    </div>
  );
}

export default BrowseGenreType;
