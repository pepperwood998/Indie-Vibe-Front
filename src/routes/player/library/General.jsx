import React, { useContext, useEffect, useState } from 'react';
import { library } from '../../../apis/API';
import { ArrowRight } from '../../../assets/svgs';
import { CollectionMain } from '../../../components/collections';
import { NavLinkColor } from '../../../components/links';
import { AuthContext, LibraryContext } from '../../../contexts';
import { capitalize, useEffectSkip } from '../../../utils/Common';
import GroupEmpty from '../../../components/groups/GroupEmpty';

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

  // effect: init
  useEffect(() => {
    library(authState.token, userId)
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
    const items = data[`${ctxFav.type}s`];
    if (items) {
      let target = [...items];
      target.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });
      setData({ ...data, [`${ctxFav.type}s`]: target });
    }
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

  return firstRender ? (
    <div className='fadein content-padding'>
      <CollectionMain loading />
    </div>
  ) : (
    <GroupEmpty isEmpty={!exist} message='No playlists or following artists'>
      <div className='fadein content-padding'>
        {Object.keys(data).map((key, index) => {
          if (data[key].length > 0) {
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
                key={index}
              />
            );
          }
        })}
      </div>
    </GroupEmpty>
  );
}

export default General;
