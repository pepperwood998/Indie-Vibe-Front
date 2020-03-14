import React, { useState } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize } from '../../../utils/Common';

function Mono(props) {
  const { type } = props;
  const [data, setData] = useState({
    items: props.data.items,
    offset: props.data.offset,
    limit: props.data.limit,
    total: props.data.total
  });

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
    />
  );
}

export default Mono;
