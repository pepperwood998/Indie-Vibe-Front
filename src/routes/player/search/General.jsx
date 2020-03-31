import React, { useContext, useEffect, useState } from 'react';
import { search } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import {
  CollectionGenres,
  CollectionMain,
  CollectionTracks
} from '../../../components/collections';
import GroupEmpty from '../../../components/groups/GroupEmpty';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { capitalize, useEffectSkip } from '../../../utils/Common';

const model = {
  items: [],
  offset: 0,
  limit: 0,
  total: 0
};
function General(props) {
  // contexts
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  // states
  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    tracks: { ...model },
    artists: { ...model },
    releases: { ...model },
    playlists: { ...model },
    profiles: { ...model },
    genres: { ...model }
  });

  // props
  const { key: searchKey } = props.match.params;
  const exist = Object.keys(data).some(key => data[key].total > 0);

  // effect: init
  useEffect(() => {
    setFirstRender(true);
    search(authState.token, searchKey)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
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
    const key = `${ctxFav.type}s`;
    const items = [...data[key].items];
    items.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setData({
      ...data,
      [key]: { ...data[key], items }
    });
  }, [libState.ctxFav]);

  // effect-skip: delete playlist
  useEffectSkip(() => {
    const playlists = [...data.playlists.items];
    setData({
      ...data,
      playlists: {
        ...data.playlists,
        items: playlists.filter(item => item.id !== libState.ctxDelPlaylistId),
        total: data.playlists.total - 1
      }
    });
  }, [libState.ctxDelPlaylistId]);

  // effect-skip: playlist privacy
  useEffectSkip(() => {
    const { ctxPlaylistPrivate } = libState;
    const playlists = [...data.playlists.items];
    playlists.some(playlist => {
      if (ctxPlaylistPrivate.id === playlist.id) {
        playlist.status = ctxPlaylistPrivate.status;
        return true;
      }
    });
    setData({ ...data, playlists: { ...data.playlists, items: playlists } });
  }, [libState.ctxPlaylistPrivate]);

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty
      isEmpty={!exist}
      message={`No search results for "${searchKey}"`}
    >
      <div className='fadein content-padding'>
        {Object.keys(data).map((key, index) => {
          if (data[key].total > 0) {
            let href = `/player/search/${searchKey}/${key}`;

            if (key === 'tracks') {
              return (
                <CollectionTracks
                  header={
                    <NavLinkColor
                      href={href}
                      className='header-title font-white'
                    >
                      {capitalize(key)}
                      <ArrowRight />
                    </NavLinkColor>
                  }
                  items={data[key].items}
                  type='search'
                  key={index}
                />
              );
            } else if (key === 'genres') {
              return (
                <CollectionGenres
                  header={
                    <NavLinkColor
                      href={href}
                      className='header-title font-white'
                    >
                      {capitalize(key)}
                      <ArrowRight />
                    </NavLinkColor>
                  }
                  items={data[key].items}
                />
              );
            } else {
              return (
                <CollectionMain
                  header={
                    <NavLinkColor
                      href={href}
                      className='header-title font-white'
                    >
                      {capitalize(key)}
                      <ArrowRight />
                    </NavLinkColor>
                  }
                  items={data[key].items}
                  key={index}
                />
              );
            }
          }
        })}
      </div>
    </GroupEmpty>
  );
}

export default General;
