import React, { useState, useEffect, useContext } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize } from '../../../utils/Common';
import { library, getPlaylistsMe } from '../../../apis/API';
import { AuthContext } from '../../../contexts';
import { ButtonLoadMore } from '../../../components/buttons';

function Mono(props) {
  const { type } = props;
  const userId = props.match ? props.match.params.id : '';

  const { state: authState } = useContext(AuthContext);
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

  const handleToggleFavorite = (type, index, relation) => {
    let items = [...data.items];
    items.some((item, i) => {
      if (index === i) {
        item.relation = [...relation];
        return true;
      }
    });
    setData({ ...data, items });
  };

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
        handleToggleFavorite={handleToggleFavorite}
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
        handleToggleFavorite={handleToggleFavorite}
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
