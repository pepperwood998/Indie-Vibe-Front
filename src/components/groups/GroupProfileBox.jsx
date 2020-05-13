import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { performActionFavorite } from '../../apis/API';
import { streamCollection } from '../../apis/StreamAPI';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { FavoriteIcon, UnFavoriteIcon } from '../../assets/svgs';
import { AuthContext, LibraryContext, StreamContext } from '../../contexts';
import { formatNumber, useEffectSkip } from '../../utils/Common';
import { ButtonIcon, ButtonMain, ButtonMore } from '../buttons';

function GroupProfileBox({ collapsed = false, data = {}, loading = false }) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const [profile, setData] = useState({});

  let wrapperClasses =
    'profile-header-wrapper' + (collapsed ? ' collapsed' : '');
  let isCurrentList =
    streamState.playFromType === 'artist' &&
    profile.id === streamState.playFromId;

  // effect: init
  useEffect(() => {
    setData({ ...profile, ...data });
  }, [data.id]);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    if (
      (ctxFav.type === 'profile' || ctxFav.type == 'artist') &&
      ctxFav.id === profile.id
    )
      setData({ ...profile, relation: [...ctxFav.relation] });
  }, [libState.ctxFav]);

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      'profile',
      profile.id,
      profile.relation,
      action
    )
      .then(relation => {
        setData({ ...profile, relation });
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
      streamCollection(authState.token, 'artist', profile.id)
        .then(res => {
          if (res.status === 'success' && res.data.length) {
            streamDispatch(
              streamActions.start(
                res.data,
                'artist',
                profile.id,
                authState.role
              )
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
          {loading ? (
            <div className='skeleton'>
              <Skeleton width='100%' height='100%' circle />
            </div>
          ) : (
            <img
              src={profile.thumbnail ? profile.thumbnail : AvatarPlaceholder}
            />
          )}
        </div>
        <div className='profile-header__info'>
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <span className='font-short-extra font-weight-bold font-white ellipsis one-line'>
              {profile.displayName}
            </span>
          )}
          {loading ? (
            <Skeleton width={150} />
          ) : (
            <span className='followers font-short-regular font-gray-light ellipsis one-line'>
              {formatNumber(profile.followersCount)} followers
            </span>
          )}

          <div className='action'>
            {loading ? (
              <Skeleton height={40} width={150} />
            ) : (
              <React.Fragment>
                {profile.type === 'artist' ? (
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
                {profile.relation && profile.id !== authState.id ? (
                  <React.Fragment>
                    {profile.relation.includes('favorite') ? (
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
                        type:
                          profile.role.id === 'r-artist' ? 'artist' : 'profile',
                        id: profile.id,
                        relation: profile.relation
                      }}
                    />
                  </React.Fragment>
                ) : (
                  ''
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupProfileBox;
