import React, { useContext, useRef, useEffect } from 'react';
import { performActionFavorite, deleteTrackList } from '../../apis/API';
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

  const ref = useRef();

  useEffect(() => {
    let ctxMenuBoudingRect = ref.current.getBoundingClientRect();
    if (
      ctxMenuBoudingRect.y + ctxMenuBoudingRect.height >=
      window.innerHeight
    ) {
      libDispatch(
        libActions.updateCtxPos([
          ctxMenuBoudingRect.x + 30,
          window.innerHeight - ctxMenuBoudingRect.height - 10
        ])
      );
    }
  }, []);

  const handleClose = () => {
    libDispatch(libActions.closeCtxMenu());
  };

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

  let superprops = {
    elemRef: ref,
    content,
    handlers: {
      handleClose,
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
