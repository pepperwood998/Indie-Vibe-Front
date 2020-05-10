import React, { useContext, useEffect, useState } from 'react';
import { getPlaylists } from '../../../apis/API';
import { CollectionMain } from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';
import { ButtonLoadMore } from '../../../components/buttons';
import GroupEmpty from '../../../components/groups/GroupEmpty';

const model = {
  items: [],
  offset: 0,
  limit: 0,
  total: 0
};
function LibraryPlaylists(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(0);
  const [own, setOwn] = useState({ ...model });
  const [fav, setFav] = useState({ ...model });

  const { id: targetId } = props.match.params;
  const isEmpty = own.total === 0 && fav.total === 0;

  // effect: init
  useEffect(() => {
    // owned playlists
    getPlaylists(authState.token, authState.id, targetId)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setFirstRender(last => last + 1);
          setOwn({ ...own, ...res.data });
        } else throw res.data;
      })
      .catch(err => {
        setFirstRender(last => last + 1);
        console.error(err);
      });

    // favorite playlists
    getPlaylists(authState.token, authState.id, targetId, 'favorite')
      .then(res => {
        if (res.status === 'success' && res.data) {
          setFirstRender(last => last + 1);
          setFav({ ...fav, ...res.data });
        } else throw res.data;
      })
      .catch(err => {
        setFirstRender(last => last + 1);
        console.error(err);
      });
  }, [targetId]);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    let ownPlaylists = [...own.items];
    ownPlaylists.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setOwn({ ...fav, items: ownPlaylists });

    let favPlaylists = [...fav.items];
    favPlaylists.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setFav({ ...fav, items: favPlaylists });
  }, [libState.ctxFav]);

  // effect-skip: delete playlist
  useEffectSkip(() => {
    setOwn({
      ...own,
      items: own.items.filter(item => libState.ctxDelPlaylistId !== item.id),
      total: own.total - 1
    });
  }, [libState.ctxDelPlaylistId]);

  // effect-skip: playlist privacy
  useEffectSkip(() => {
    const { ctxPlaylistPrivate } = libState;
    const items = [...own.items];
    items.some(playlist => {
      if (ctxPlaylistPrivate.id === playlist.id) {
        playlist.status = ctxPlaylistPrivate.status;
        return true;
      }
    });
    setOwn({ ...own, items });
  }, [libState.ctxPlaylistPrivate]);

  // handlers
  const handleLoadMoreOwn = () => {
    getPlaylists(
      authState.token,
      authState.id,
      targetId,
      'own',
      own.offset + own.limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          setOwn({
            ...own,
            items: [...own.items, ...res.data.items],
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

  const handleLoadMoreFav = () => {
    getPlaylists(
      authState.token,
      authState.id,
      targetId,
      'favorite',
      fav.offset + fav.limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          setFav({
            ...fav,
            items: [...fav.items, ...res.data.items],
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

  return firstRender < 2 ? (
    <div className='library-playlists fadein content-padding'>
      <CollectionMain loading />
    </div>
  ) : (
    <GroupEmpty isEmpty={isEmpty} message='No playlists in library'>
      <div className='library-playlists fadein content-padding'>
        {own.items.length <= 0 ? (
          ''
        ) : (
          <section>
            <CollectionMain
              header='Created playlists'
              items={own.items}
              full={true}
            />
            {own.total > own.offset + own.limit ? (
              <ButtonLoadMore onClick={handleLoadMoreOwn}>
                Load more
              </ButtonLoadMore>
            ) : (
              ''
            )}
          </section>
        )}
        {fav.items.length <= 0 ? (
          ''
        ) : (
          <section>
            <CollectionMain
              header='Favorite playlists'
              items={fav.items}
              full={true}
            />
            {fav.total > fav.offset + fav.limit ? (
              <ButtonLoadMore onClick={handleLoadMoreFav}>
                Load more
              </ButtonLoadMore>
            ) : (
              ''
            )}
          </section>
        )}
      </div>
    </GroupEmpty>
  );
}

export default LibraryPlaylists;
