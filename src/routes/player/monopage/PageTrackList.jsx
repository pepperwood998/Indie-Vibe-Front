import React, { useState, useEffect, useContext } from 'react';

import { NavLinkUnderline } from '../../../components/links';
import { ButtonMain, ButtonIcon } from '../../../components/buttons';
import { InputForm } from '../../../components/inputs';
import { CollectionTrackTable } from '../../../components/collections';
import { getTrackList, performActionFavorite } from '../../../apis/API';
import { AuthContext, StreamContext } from '../../../contexts';
import { streamCollection } from '../../../apis/StreamAPI';

import { UnFavoriteIcon, MoreIcon, FavoriteIcon } from '../../../assets/svgs';
import Placeholder from '../../../assets/imgs/placeholder.png';

function TrackList(props) {
  // props
  const { type } = props;
  const id = props.match.params.id;

  // contexts
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  // states
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

  // effects
  useEffect(() => {
    getTrackList(authState.token, id, type).then(res => {
      if (res.status === 'success' && res.data) {
        setData({ ...data, ...res.data });
        if (type === 'playlist') {
          setOwner({ ...owner, ...res.data.owner });
        } else {
          setOwner({ ...owner, ...res.data.artist });
        }
      }
    });
  }, []);

  // handling
  const handleToggleFavorite = (index, relation, type) => {
    let tracks = { ...data.tracks };
    tracks.items.some((item, i) => {
      if (index === i) {
        if (type === 'playlist') {
          item.track.relation = [...relation];
        } else {
          item.relation = [...relation];
        }
        return true;
      }
    });
    setData({ ...data, tracks });
  };

  const handlePaused = () => {
    streamDispatch(streamAction.requestPaused(true));
  };
  const handlePlay = () => {
    if (id === streamState.collectionId) {
      streamDispatch(streamAction.requestPaused(false));
    } else {
      streamCollection(authState.token, type, id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(
            streamAction.start({
              queue: res.data,
              playType: type,
              collectionId: id
            })
          );
        }
      });
    }
  };

  const handleListToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      type,
      id,
      data.relation,
      action
    ).then(r => {
      setData({ ...data, relation: r });
    });
  };

  return (
    <div className='content-page'>
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
                    owner.role.id === 'r-artist' ? 'artist' : 'library'
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
                  : data.date}
              </span>
            </div>
          </div>
        </div>
        <div className='track-list__action'>
          <div className='action'>
            {id === streamState.collectionId && !streamState.paused ? (
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
            <ButtonIcon>
              <MoreIcon />
            </ButtonIcon>
          </div>
          <div className='filter'>
            <InputForm placeholder='Filter' />
          </div>
        </div>
        <div className='track-list__content'>
          <CollectionTrackTable
            data={data.tracks}
            type={type}
            collectionId={data.id}
            handleToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}

export default TrackList;
