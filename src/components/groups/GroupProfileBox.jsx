import React, { useContext, useState, useEffect } from 'react';

import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { ButtonMain, ButtonIcon } from '../buttons';
import { FavoriteIcon, UnFavoriteIcon, MoreIcon } from '../../assets/svgs';
import { AuthContext } from '../../contexts';
import { profile, performActionFavorite } from '../../apis/API';
import { formatNumber } from '../../utils/Common';

function GroupProfileBox(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    profile(authState.token, props.id).then(res => {
      setFirstRender(false);
      if (res.status === 'success' && res.data) {
        setData({ ...data, ...res.data });
      }
    });
  }, []);

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

  return (
    <div className='profile-header fadein'>
      {firstRender ? (
        ''
      ) : (
        <React.Fragment>
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
                  <ButtonIcon>
                    <MoreIcon />
                  </ButtonIcon>
                </React.Fragment>
              ) : (
                ''
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default GroupProfileBox;
