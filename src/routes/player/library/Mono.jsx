import React, { useState, useEffect, useContext } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize, useEffectSkip } from '../../../utils/Common';
import { library, getPlaylistsMe } from '../../../apis/API';
import { AuthContext, LibraryContext } from '../../../contexts';
import { ButtonLoadMore } from '../../../components/buttons';

function Mono(props) {
  const { type } = props;
  const userId = props.match ? props.match.params.id : '';

  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [data, setData] = useState({
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  });

  useEffect(() => {
    getLibraryTarget(authState, userId, type)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffectSkip(() => {
    const { ctxFav } = libState;
    let items = [...data.items];
    items.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setData({ ...data, items });
  }, [libState.ctxFav]);

  const handleLoadMore = () => {
    getLibraryTarget(authState, userId, type, data.offset + data.limit)
      .then(res => {
        if (res.status === 'success' && res.data.items) {
          setData({
            ...data,
            items: [...data.items, ...res.data.items],
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

  let collection = '';

  if (type === 'favorite') {
    collection = (
      <CollectionTracks
        header={
          data.total > 0 ? data.total + ` ${type}s` : `No ${capitalize(type)}`
        }
        data={data}
        type='favorite'
      />
    );
  } else {
    collection = (
      <CollectionMain
        header={
          data.total > 0 ? data.total + ` ${type}s` : `No ${capitalize(type)}`
        }
        data={data}
        type={type}
      />
    );
  }

  return (
    <React.Fragment>
      {collection}
      {data.total > data.offset + data.limit ? (
        <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
      ) : (
        ''
      )}
    </React.Fragment>
  );
}

const getLibraryTarget = (authState, userId, type, offset, limit) => {
  if (type === 'playlist' && userId === authState.id) {
    return getPlaylistsMe(authState.token, offset, limit);
  }

  return library(authState.token, userId, type, offset, limit);
};

export default Mono;
