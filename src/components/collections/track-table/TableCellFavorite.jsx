import React, { useContext } from 'react';
import { performActionFavorite } from '../../../apis/API';
import { FavoriteIcon, UnFavoriteIcon } from '../../../assets/svgs';
import { AuthContext, StreamContext, LibraryContext } from '../../../contexts';

function CellFavorite(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      'track',
      props.id,
      props.relation,
      action
    )
      .then(r => {
        streamDispatch(streamActions.setTrackFavorite(props.id, r));
        libDispatch(
          libActions.toggleFavorite({
            id: props.id,
            type: 'track',
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='favorite center side'>
      {props.relation.includes('favorite') ? (
        <FavoriteIcon
          className='svg--cursor svg--scale svg--blue'
          onClick={() => {
            handleToggleFavorite('unfavorite');
          }}
        />
      ) : (
        <UnFavoriteIcon
          className='svg--cursor svg--scale'
          onClick={() => {
            handleToggleFavorite('favorite');
          }}
        />
      )}
    </div>
  );
}

export default CellFavorite;
