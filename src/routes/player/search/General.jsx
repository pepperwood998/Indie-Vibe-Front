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

function General(props) {
  // contexts
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  // states
  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    tracks: [],
    artists: [],
    releases: [],
    playlists: [],
    profiles: [],
    genres: []
  });

  // props
  const { key: searchKey } = props.match.params;
  let exist = Object.keys(data).find(key => data[key].length > 0);
  let render = '';

  // effect: init
  useEffect(() => {
    setFirstRender(true);
    search(authState.token, props.match.params.key)
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
    let target = [...data[`${ctxFav.type}s`]];
    target.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setData({ ...data, [`${ctxFav.type}s`]: target });
  }, [libState.ctxFav]);

  // effect-skip: delete playlist
  useEffectSkip(() => {
    let target = [...data.playlists];
    setData({
      ...data,
      playlists: target.filter(item => item.id !== libState.ctxDelPlaylistId)
    });
  }, [libState.ctxDelPlaylistId]);

  // effect-skip: playlist privacy
  useEffectSkip(() => {
    const { ctxPlaylistPrivate } = libState;
    let playlists = [...data.playlists];
    playlists.some(playlist => {
      if (ctxPlaylistPrivate.id === playlist.id) {
        playlist.status = ctxPlaylistPrivate.status;
        return true;
      }
    });
    setData({ ...data, playlists });
  }, [libState.ctxPlaylistPrivate]);

  if (exist) {
    render = Object.keys(data).map((key, index) => {
      if (data[key].length > 0) {
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
              data={{ items: data[key], offset: 0, limit: data[key].length }}
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
            items={data[key]}
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
