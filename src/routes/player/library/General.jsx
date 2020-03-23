import React, { useContext, useEffect, useState } from 'react';
import { library } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { capitalize, useEffectSkip } from '../../../utils/Common';

function General(props) {
  // contexts
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  // states
  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    playlists: [],
    artists: []
  });

  // props
  const { id: userId } = props.match.params;
  let exist = Object.keys(data).find(key => data[key].length > 0);
  let render = '';

  // effect: init
  useEffect(() => {
    library(authState.token, props.match.params.id)
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

        return (
          <CollectionMain
            header={
              <NavLinkColor
                href={`/player/library/${userId}/${key}`}
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
        Library empty
      </span>
    );
  }

  return firstRender ? '' : <div className='fadein'>{render}</div>;
}

export default General;
