import React, { useContext, useEffect, useState } from 'react';
import { search } from '../../../apis/API';
import { ButtonLoadMore } from '../../../components/buttons';
import {
  CollectionGenres,
  CollectionMain,
  CollectionTracks
} from '../../../components/collections';
import GroupEmpty from '../../../components/groups/GroupEmpty';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';

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
  const { key: searchKey } = props.match.params;
  const { type } = props;

  // effect: init
  useEffect(() => {
    search(authState.token, searchKey, props.type)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [searchKey]);

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

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty
      isEmpty={!data.items.length}
      message={`No ${type}s for "${searchKey}"`}
    >
      <div className='fadein content-padding'>
        {type === 'track' ? (
          <CollectionTracks
            header={data.total + ` ${type}s`}
            items={data.items}
            type='search'
          />
        ) : type === 'genre' ? (
          <CollectionGenres
            header={data.total + ` ${type}s`}
            items={data.items}
          />
        ) : (
          <CollectionMain
            header={data.total + ` ${type}s`}
            items={data.items}
            type={type}
          />
        )}
        {data.total > data.offset + data.limit ? (
          <ButtonLoadMore onClick={handleLoadMore}>Load more</ButtonLoadMore>
        ) : (
          ''
        )}
      </div>
    </GroupEmpty>
  );
}

export default Mono;
