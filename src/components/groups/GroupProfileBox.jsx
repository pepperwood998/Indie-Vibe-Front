import React, { useContext, useState, useEffect } from 'react';
import { performActionFavorite } from '../../apis/API';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.jpg';
import { FavoriteIcon, UnFavoriteIcon } from '../../assets/svgs';
import { AuthContext, LibraryContext } from '../../contexts';
import { formatNumber, useEffectSkip } from '../../utils/Common';
import { ButtonIcon, ButtonMain, ButtonMore } from '../buttons';

function GroupProfileBox(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [data, setData] = useState({});

  let wrapperClasses =
    'profile-header-wrapper' + (props.collapsed ? ' collapsed' : '');

  // effect: init
  useEffect(() => {
    setData({ ...data, ...props.data });
  }, [props.data.id]);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
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

  return (
    <div className={wrapperClasses}>
      <div className='profile-header fadein'>
        <div className='profile-header__avatar'>
          <img
            src={data.thumbnail ? data.thumbnail : AvatarPlaceholder}
          />
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
                    type:
                    data.role.id === 'r-artist' ? 'artist' : 'profile',
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
