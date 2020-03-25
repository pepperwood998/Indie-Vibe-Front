import React, { useState, useEffect, useContext, useRef } from 'react';

import { capitalize, useEffectSkip } from '../../../utils/Common';
import { NavLinkColor } from '../../../components/links';
import {
  CollectionTracks,
  CollectionMain
} from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { search } from '../../../apis/API';

import { ArrowRight } from '../../../assets/svgs';

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
  let exist = Object.keys(data).some(key => data[key].total > 0);
  let render = '';

  // effect: init
  useEffect(() => {
    setFirstRender(true);
    search(authState.token, searchKey)
      .then(res => {
        if (res.status === 'success') {
          setData({ ...data, ...res.data });
          setFirstRender(false);
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

  if (exist) {
    render = Object.keys(data).map((key, index) => {
      if (data[key].total > 0) {
        let type = key.substr(0, key.length - 1);
        if (type === 'track') {
          return (
            <CollectionTracks
              header={
                <NavLinkColor
                  href={`/player/search/${searchKey}/${key}`}
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
        }

        return (
          <CollectionMain
            header={
              <NavLinkColor
                href={`/player/search/${searchKey}/${key}`}
                className='header-title font-white'
              >
                {capitalize(key)}
                <ArrowRight />
              </NavLinkColor>
            }
            items={data[key].items}
            type={type}
            key={index}
          />
        );
      }
    });
  } else {
    render = (
      <span className='font-short-extra font-white font-weight-bold'>
        No results found
      </span>
    );
  }

  return firstRender ? '' : <div className='fadein'>{render}</div>;
}

export default General;
