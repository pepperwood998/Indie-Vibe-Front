import React, { useState, useEffect, useContext } from 'react';

import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { capitalize, useEffectSkip } from '../../../utils/Common';
import { search } from '../../../apis/API';
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
  let collection = '';

  // effect: init
  useEffect(() => {
    search(authState.token, props.match.params.key, props.type)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

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

  // effect-skip: delete playlist
  useEffectSkip(() => {
    if (type === 'playlist') {
      setData({
        ...data,
        items: data.items.filter(item => item.id !== libState.ctxDelPlaylistId),
        total: data.total - 1
      });
    }
  }, [libState.ctxDelPlaylistId]);

  // effect-skip: playlist privacy
  useEffectSkip(() => {
    if (type === 'playlist') {
      const { ctxPlaylistPrivate } = libState;
      let items = [...data.items];
      items.some(playlist => {
        if (ctxPlaylistPrivate.id === playlist.id) {
          playlist.status = ctxPlaylistPrivate.status;
          return true;
        }
      });
      setData({ ...data, items });
    }
  }, [libState.ctxPlaylistPrivate]);

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
        items={data.items}
        type={type}
      />
    );
  }

  return (
    <div className='fadein'>
      {firstRender ? (
        ''
      ) : (
        <React.Fragment>
          {collection}
          {data.total > data.offset + data.limit ? (
            <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
          ) : (
            ''
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default Mono;
