import React, { useState, useEffect, useContext } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize } from '../../../utils/Common';
import { search } from '../../../apis/API';
import { AuthContext } from '../../../contexts';

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
        if (res.status === 'success') {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // // 'test' placeholder
  // const [data, setData] = useState(test[`${type}s`]);

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

  if (type === 'track') {
    return (
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
  }

  return (
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

export default Mono;
