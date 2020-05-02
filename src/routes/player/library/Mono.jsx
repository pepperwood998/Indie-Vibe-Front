import React, { useContext, useEffect, useState } from 'react';
import { library } from '../../../apis/API';
import { ButtonLoadMore } from '../../../components/buttons';
import {
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
  const { type } = props;
  const userId = props.match ? props.match.params.id : '';

  // effect: init
  useEffect(() => {
    library(authState.token, userId, type)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
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

  return firstRender ? (
    <div className='fadein content-padding'>
      {type === 'track' ? (
        <CollectionTracks type='favorite' playFromId={userId} loading />
      ) : (
        <CollectionMain loading />
      )}
    </div>
  ) : (
    <GroupEmpty isEmpty={data.total === 0} message={`No ${type}s in library`}>
      <div className='fadein content-padding'>
        {type === 'track' ? (
          <CollectionTracks
            header={data.total + ` ${type}s`}
            items={data.items}
            type='favorite'
            playFromId={userId}
          />
        ) : (
          <CollectionMain
            header={data.total + ` ${type}s`}
            items={data.items}
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
