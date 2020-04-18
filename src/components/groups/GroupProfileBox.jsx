import React, { useContext, useEffect, useState } from 'react';
import { performActionFavorite } from '../../apis/API';
import { streamCollection } from '../../apis/StreamAPI';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { FavoriteIcon, UnFavoriteIcon } from '../../assets/svgs';
import { AuthContext, LibraryContext, StreamContext } from '../../contexts';
import { formatNumber, useEffectSkip } from '../../utils/Common';
import { ButtonIcon, ButtonMain, ButtonMore } from '../buttons';

function GroupProfileBox(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const [data, setData] = useState({});

  let wrapperClasses =
    'profile-header-wrapper' + (props.collapsed ? ' collapsed' : '');
  let isCurrentList =
    streamState.playFromType === 'artist' && data.id === streamState.playFromId;

  // effect: init
  useEffect(() => {
    setData({ ...data, ...props.data });
  }, [props.data.id]);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    if (
      (ctxFav.type === 'profile' || ctxFav.type == 'artist') &&
      ctxFav.id === data.id
    )
      setData({ ...data, relation: [...ctxFav.relation] });
  }, [libState.ctxFav]);

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      'profile',
      data.id,
      data.relation,
      action
    )
      .then(relation => {
        setData({ ...data, relation });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePaused = () => {
    streamDispatch(streamActions.togglePaused(true));
  };
  const handlePlay = () => {
    if (isCurrentList) {
      streamDispatch(streamActions.togglePaused(false));
    } else {
      streamCollection(authState.token, 'artist', data.id)
        .then(res => {
          if (res.status === 'success' && res.data.length) {
            streamDispatch(
              streamActions.start(res.data, 'artist', data.id, authState.role)
            );
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  return (
    <div className={wrapperClasses}>
      <div className='profile-header fadein'>
        <div className='profile-header__avatar'>
          <img src={data.thumbnail ? data.thumbnail : AvatarPlaceholder} />
        </div>
        <div className='profile-header__info'>
          <span className='font-short-extra font-weight-bold font-white'>
            {data.displayName}
          </span>
          <span className='followers font-short-regular font-gray-light'>
            {formatNumber(data.followersCount)} followers
          </span>

          <div className='action'>
            {data.type === 'artist' ? (
              isCurrentList && !streamState.paused ? (
                <ButtonMain revert onClick={handlePaused}>
                  PAUSE
                </ButtonMain>
              ) : (
                <ButtonMain onClick={handlePlay}>PLAY</ButtonMain>
              )
            ) : (
              ''
            )}
            {data.relation && data.id !== authState.id ? (
              <React.Fragment>
                {data.relation.includes('favorite') ? (
                  <ButtonIcon>
                    <FavoriteIcon
                      className='svg--blue'
                      onClick={() => {
                        handleToggleFavorite('unfavorite');
                      }}
                    />
                  </ButtonIcon>
                ) : (
                  <ButtonIcon>
                    <UnFavoriteIcon
                      onClick={() => {
                        handleToggleFavorite('favorite');
                      }}
                    />
                  </ButtonIcon>
                )}
                <ButtonMore
                  ctxData={{
                    type: data.role.id === 'r-artist' ? 'artist' : 'profile',
                    id: data.id,
                    relation: data.relation
                  }}
                />
              </React.Fragment>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupProfileBox;
