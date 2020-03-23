import React, { useState, useEffect, useContext } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize, useEffectSkip } from '../../../utils/Common';
import { library } from '../../../apis/API';
import { AuthContext, LibraryContext } from '../../../contexts';
import { ButtonLoadMore } from '../../../components/buttons';

function Mono(props) {
  // contexts
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  // states
  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  });

  // props
  const { type } = props;
  const userId = props.match ? props.match.params.id : '';

  // effect: init
  useEffect(() => {
    library(authState.token, userId, type)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
          setFirstRender(false);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [userId]);

  // effect-skip: favorite
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
    library(authState.token, userId, type, data.offset + data.limit)
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
        items={data.items}
        type={type}
      />
    );
  }

  return firstRender ? (
    ''
  ) : (
    <div className='fadein'>
      {collection}
      {data.total > data.offset + data.limit ? (
        <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
      ) : (
        ''
      )}
    </div>
  );
}

export default Mono;
