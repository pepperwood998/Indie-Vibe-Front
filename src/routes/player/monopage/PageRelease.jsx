import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getTrackList, performActionFavorite } from '../../../apis/API';
import { streamCollection } from '../../../apis/StreamAPI';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { FavoriteIcon, UnFavoriteIcon } from '../../../assets/svgs';
import {
  ButtonIcon,
  ButtonLoadMore,
  ButtonMain,
  ButtonMore
} from '../../../components/buttons';
import { TrackTable } from '../../../components/collections/track-table';
import GroupEmpty from '../../../components/groups/GroupEmpty';
import { usePageTitle } from '../../../components/hooks';
import { InputForm } from '../../../components/inputs';
import { NavLinkUnderline } from '../../../components/links';
import { AuthContext, LibraryContext, StreamContext } from '../../../contexts';
import { contain, getDatePart, useEffectSkip } from '../../../utils/Common';

function Release(props) {
  // contexts
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { state: libState } = useContext(LibraryContext);

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
    followersCount: 0,
    releaseType: {}
  });
  const [owner, setOwner] = useState({ role: {} });
  const [existed, setExisted] = useState(true);
  const [extra, setExtra] = useState({
    filter: ''
  });

  // props
  const { tracks } = data;
  const id = props.match.params.id;
  let isCurrentList =
    streamState.playFromType === 'release' && id === streamState.playFromId;

  // effect: init
  useEffect(() => {
    setFirstRender(true);
    getTrackList(authState.token, id, 'release')
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setExisted(true);
          setData({ ...data, ...res.data });
          setOwner({ ...owner, ...res.data.artist });
        } else {
          throw 'Error viewing release';
        }
      })
      .catch(error => {
        setFirstRender(false);
        setExisted(false);
      });
  }, [id]);

  usePageTitle(`${data.releaseType.name} - ${data.title}`, data.title);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    if (ctxFav.type === 'release') {
      setData({ ...data, relation: ctxFav.relation });
    } else {
      let tracks = { ...data.tracks };
      tracks.items.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });
      setData({ ...data, tracks });
    }
  }, [libState.ctxFav]);

  const handlePaused = () => {
    streamDispatch(streamAction.togglePaused(true));
  };
  const handlePlay = () => {
    if (isCurrentList) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      streamCollection(authState.token, 'release', id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(
            streamAction.start(res.data, 'release', id, authState.role)
          );
        }
      });
    }
  };

  const handleListToggleFavorite = action => {
    performActionFavorite(authState.token, 'release', id, data.relation, action)
      .then(r => {
        setData({ ...data, relation: r });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleLoadMore = () => {
    getTrackList(authState.token, id, 'release', tracks.offset + tracks.limit)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const newTracks = res.data.tracks;

          setData({
            ...data,
            tracks: {
              ...tracks,
              ...newTracks,
              items: [...tracks.items, ...newTracks.items]
            }
          });
        } else {
          throw res.data;
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleFilter = e => {
    setExtra({ ...extra, filter: e.target.value });
  };

  return (
    <GroupEmpty isEmpty={!existed} message="Release doesn't exist.">
      <div className='content-page fadein'>
        <div className='track-list mono-page content-padding'>
          <div className='track-list__header'>
            <div className='avatar'>
              {firstRender ? (
                <Skeleton width='100%' height='100%' />
              ) : (
                <img src={data.thumbnail ? data.thumbnail : Placeholder} />
              )}
            </div>
            <div className='info'>
              <div className='info__top'>
                <span className='font-short-extra font-weight-bold font-white'>
                  {data.title || <Skeleton />}
                </span>
                <div>
                  <span className='font-short-regular font-gray-light'>
                    by&nbsp;
                  </span>
                  {firstRender ? (
                    <Skeleton />
                  ) : (
                    <NavLinkUnderline
                      href={`/player/artist/${owner.id}`}
                      className='font-short-regular font-white'
                    >
                      {owner.displayName}
                    </NavLinkUnderline>
                  )}
                </div>
                <p className='description font-short-big font-white'>
                  {data.description}
                </p>
              </div>
              <div className='info__bottom font-short-regular font-gray-light'>
                {firstRender ? (
                  <Skeleton />
                ) : (
                  <React.Fragment>
                    <span className='uppercase'>
                      {data.releaseType.name || 'release'}
                    </span>
                    <span className='dot'>&#8226;</span>
                    <span>{data.tracks.total} tracks</span>
                    <span className='dot'>&#8226;</span>
                    <span>{getDatePart(data.date)}</span>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
          <div className='track-list__action'>
            <div className='action'>
              {isCurrentList && !streamState.paused ? (
                <ButtonMain revert onClick={handlePaused}>
                  PAUSE
                </ButtonMain>
              ) : (
                <ButtonMain onClick={handlePlay}>PLAY</ButtonMain>
              )}
              {firstRender ? (
                ''
              ) : (
                <React.Fragment>
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
                      type: 'release',
                      id: id,
                      relation: data.relation,
                      status: data.status,
                      artistId: data.artist ? data.artist.id : ''
                    }}
                  />
                </React.Fragment>
              )}
            </div>
            <div className='filter'>
              <InputForm
                placeholder='Filter'
                onChange={handleFilter}
                value={extra.filter}
              />
            </div>
          </div>
          <div className='track-list__content'>
            {firstRender ? (
              <TrackTable loading={true} />
            ) : (
              <React.Fragment>
                <TrackTable
                  items={
                    extra.filter
                      ? data.tracks.items.filter(item =>
                          contain(extra.filter, item.title)
                        )
                      : data.tracks.items
                  }
                  releaseArtistId={data.artist ? data.artist.id : ''}
                  playFromId={data.id}
                  type='release'
                />
                {tracks.total > tracks.offset + tracks.limit ? (
                  <ButtonLoadMore onClick={handleLoadMore}>
                    Load more
                  </ButtonLoadMore>
                ) : (
                  ''
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </GroupEmpty>
  );
}

export default Release;
