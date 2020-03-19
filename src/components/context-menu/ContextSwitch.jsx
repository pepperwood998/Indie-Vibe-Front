import React, { useContext } from 'react';
import { performActionFavorite } from '../../apis/API';
import { AuthContext, LibraryContext } from '../../contexts';
import ContextPlaylist from './ContextPlaylist';
import ContextRelease from './ContextRelease';
import ContextTrack from './ContextTrack';
import ContextUser from './ContextUser';

function ContextSwitch(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const handleToggleFavorite = action => {
    libDispatch(libActions.closeCtxMenu());
    performActionFavorite(
      authState.token,
      content.type,
      content.id,
      content.relation,
      action
    )
      .then(r => {
        libDispatch(
          libActions.toggleFavorite({
            id: content.id,
            type: content.type,
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  const superprops = {
    content,
    handlers: {
      handleToggleFavorite
    }
  };

  switch (content.type) {
    case 'track':
      return <ContextTrack {...superprops} />;
    case 'playlist':
      return <ContextPlaylist {...superprops} />;
    case 'release':
      return <ContextRelease {...superprops} />;
    case 'profile':
    case 'artist':
      return <ContextUser {...superprops} />;
    default:
      return '';
  }
}

export default ContextSwitch;
