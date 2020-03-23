import React, { useContext, useState, useEffect } from 'react';

import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { ButtonMain, ButtonIcon, ButtonMore } from '../buttons';
import { FavoriteIcon, UnFavoriteIcon, MoreIcon } from '../../assets/svgs';
import { AuthContext, LibraryContext } from '../../contexts';
import { profile, performActionFavorite } from '../../apis/API';
import { formatNumber, useEffectSkip } from '../../utils/Common';

function GroupProfileBox(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setFirstRender(true);
    profile(authState.token, props.id)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        } else {
          throw 'Error';
        }
      })
      .catch(err => {
        window.location.href = '/player/home';
      });
  }, [props.id]);

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

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    setData({ ...data, relation: [...ctxFav.relation] });
  }, [libState.ctxFav]);

  return (
    <div className='profile-header-wrapper'>
      {firstRender ? (
        ''
      ) : (
        <div className='profile-header fadein'>
          <div className='profile-header__avatar'>
            <img src={data.thumbnail ? data.thumbnail : AvatarPlaceholder} />
          </div>
          <div className='profile-header__info'>
            <span className='font-short-extra font-weight-bold font-white'>
              {data.displayName}
            </span>
            <span className='font-short-regular font-gray-light'>
              {formatNumber(data.followersCount)} followers
            </span>

            <div className='action'>
              {data.type === 'artist' ? (
                <ButtonMain isFitted={true}>PLAY</ButtonMain>
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
      )}
    </div>
  );
}

export default GroupProfileBox;
