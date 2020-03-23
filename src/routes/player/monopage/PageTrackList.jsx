import React, { useState, useEffect, useContext } from 'react';

import { NavLinkUnderline } from '../../../components/links';
import {
  ButtonMain,
  ButtonIcon,
  ButtonMore
} from '../../../components/buttons';
import { InputForm } from '../../../components/inputs';
import { CollectionTrackTable } from '../../../components/collections';
import {
  getTrackList,
  performActionFavorite,
  deleteTrackList
} from '../../../apis/API';
import { AuthContext, StreamContext, LibraryContext } from '../../../contexts';
import { streamCollection } from '../../../apis/StreamAPI';

import { UnFavoriteIcon, FavoriteIcon } from '../../../assets/svgs';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { useEffectSkip, getDatePart } from '../../../utils/Common';

function TrackList(props) {
  // contexts
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  // states
  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    tracks: {
      items: [],
      offset: 0,
      limit: 0,
      total: 0
    },
    relation: [],
    followersCount: 0
  });
  const [owner, setOwner] = useState({ role: {} });

  // props
  const { type } = props;
  const id = props.match.params.id;
  let isCurrentList =
    type === streamState.playFromType && id === streamState.playFromId;

  // effect: init
  useEffect(() => {
    setFirstRender(true);
    getTrackList(authState.token, id, type)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          if (type !== res.data.type) {
            window.location.href = '/player/home';
            return;
          }

          setData({ ...data, ...res.data });
          if (type === 'playlist') {
            setOwner({ ...owner, ...res.data.owner });
          } else {
            setOwner({ ...owner, ...res.data.artist });
          }
        } else {
          throw `Error viewing ${type}`;
        }
      })
      .catch(error => {
        window.location.href = '/player/home';
      });
  }, [id]);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    if (ctxFav.type === 'playlist' || ctxFav.type === 'release') {
      setData({ ...data, relation: ctxFav.relation });
    } else {
      let tracks = { ...data.tracks };
      tracks.items.some(item => {
        if (type === 'playlist') {
          if (ctxFav.id === item.track.id) {
            item.track.relation = [...ctxFav.relation];
            return true;
          }
        } else {
          if (ctxFav.id === item.id) {
            item.relation = [...ctxFav.relation];
            return true;
          }
        }
      });
      setData({ ...data, tracks });
    }
  }, [libState.ctxFav]);

  // effect-skip: delete playlist
  useEffectSkip(() => {
    if (type === 'playlist') {
      if (id === libState.ctxDelPlaylistId) {
        props.history.push(`/player/library/${authState.id}`);
      }
    }
  }, [libState.ctxDelPlaylistId]);

  // effect-skip: playlist privacy
  useEffectSkip(() => {
    const { ctxPlaylistPrivate } = libState;
    setData({ ...data, status: ctxPlaylistPrivate.status });
  }, [libState.ctxPlaylistPrivate]);

  // effect-skip: remove track playlist
  useEffectSkip(() => {
    if (type === 'playlist') {
      const { ctxDelPlaylistTrackId } = libState;
      if (ctxDelPlaylistTrackId) {
        const { tracks } = data;
        setData({
          ...data,
          tracks: {
            ...tracks,
            items: tracks.items.filter(
              item => item.track.id !== ctxDelPlaylistTrackId
            ),
            total: tracks.total - 1
          }
        });
        libDispatch(libActions.removeTrackFromPlaylist(''));
      }
    }
  }, [libState.ctxDelPlaylistTrackId]);

  const handlePaused = () => {
    streamDispatch(streamAction.togglePaused(true));
  };
  const handlePlay = () => {
    if (isCurrentList) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      streamCollection(authState.token, type, id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(streamAction.start(res.data, type, id));
        }
      });
    }
  };

  const handleListToggleFavorite = action => {
    performActionFavorite(authState.token, type, id, data.relation, action)
      .then(r => {
        setData({ ...data, relation: r });
      })
      .catch(err => {
        console.error(err);
      });
  };

  return firstRender ? (
    ''
  ) : (
    <div className='content-page fadein'>
      <div className='mono-page track-list'>
        <div className='track-list__header'>
          <div className='avatar'>
            <img src={data.thumbnail ? data.thumbnail : Placeholder} />
          </div>
          <div className='info'>
            <div className='info__top'>
              <span className='font-short-extra font-weight-bold font-white'>
                {data.title}
              </span>
              <div>
                <span className='font-short-regular font-gray-light'>
                  by&nbsp;
                </span>
                <NavLinkUnderline
                  href={`/player/${
                    type === 'release' || owner.role.id === 'r-artist'
                      ? 'artist'
                      : 'library'
                  }/${owner.id}`}
                  className='font-short-regular font-white'
                >
                  {owner.displayName}
                </NavLinkUnderline>
              </div>
              <p className='description font-short-big font-white'>
                {data.description}
              </p>
            </div>
            <div className='info__bottom font-short-regular font-gray-light'>
              <span>{type.toUpperCase()}</span>
              <span className='dot'>&#8226;</span>
              <span>{data.tracks.total} tracks</span>
              <span className='dot'>&#8226;</span>
              <span>
                {type === 'playlist'
                  ? `${data.followersCount} followers`
                  : getDatePart(data.date)}
              </span>
            </div>
          </div>
        </div>
        <div className='track-list__action'>
          <div className='action'>
            {isCurrentList && !streamState.paused ? (
              <ButtonMain onClick={handlePaused}>PAUSE</ButtonMain>
            ) : (
              <ButtonMain onClick={handlePlay}>PLAY</ButtonMain>
            )}
            {data.relation.includes('own') ? (
              ''
            ) : data.relation.includes('favorite') ? (
              <ButtonIcon>
                <FavoriteIcon
                  className='svg--blue'
                  onClick={() => handleListToggleFavorite('unfavorite')}
                />
              </ButtonIcon>
            ) : (
              <ButtonIcon>
                <UnFavoriteIcon
                  onClick={() => handleListToggleFavorite('favorite')}
                />
              </ButtonIcon>
            )}
            <ButtonMore
              ctxData={{
                type: type,
                id: id,
                relation: data.relation,
                status: data.status,
                artistId: data.artist ? data.artist.id : ''
              }}
            />
          </div>
          <div className='filter'>
            <InputForm placeholder='Filter' />
          </div>
        </div>
        <div className='track-list__content'>
          {type === 'playlist' ? (
            <CollectionTrackTable
              data={data.tracks}
              playFromId={data.id}
              type={type}
              playlistRelation={data.relation}
            />
          ) : (
            <CollectionTrackTable
              data={data.tracks}
              releaseArtistId={data.artist ? data.artist.id : ''}
              playFromId={data.id}
              type={type}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackList;
