import React, { useState, useEffect, useContext } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize } from '../../../utils/Common';
import { search } from '../../../apis/API';
import { AuthContext } from '../../../contexts';
import { ButtonLoadMore } from '../../../components/buttons';

function Mono(props) {
  const { type } = props;

  const { state: authState } = useContext(AuthContext);
  const [data, setData] = useState({
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  });

  useEffect(() => {
    search(authState.token, props.match.params.key, props.type)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleToggleFavorite = (index, relation, type) => {
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
    search(
      authState.token,
      props.match.params.key,
      props.type,
      data.offset + data.limit
    )
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

  if (type === 'track') {
    collection = (
      <CollectionTracks
        header={
          data.total > 0
            ? data.total + ` ${type}s`
            : `No results for ${capitalize(type)}`
        }
        data={data}
        type='search'
        handleToggleFavorite={handleToggleFavorite}
      />
    );
  } else {
    collection = (
      <CollectionMain
        header={
          data.total > 0
            ? data.total + ` ${type}s`
            : `No results for ${capitalize(type)}`
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

export default Mono;
