import React, { useContext, useRef, useEffect } from 'react';
import { performActionFavorite, deleteTrackList } from '../../apis/API';
import { AuthContext, LibraryContext, StreamContext } from '../../contexts';
import ContextPlaylist from './ContextPlaylist';
import ContextRelease from './ContextRelease';
import ContextTrack from './ContextTrack';
import ContextUser from './ContextUser';
import { streamCollection } from '../../apis/StreamAPI';
import { LinkWhiteColor } from '../links';

function ContextSwitch(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);
  const { actions: streamActions, dispatch: streamDispatch } = useContext(
    StreamContext
  );
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
    handleClose();
    performActionFavorite(
      authState.token,
      content.type,
      content.id,
      content.relation,
      action
    )
      .then(r => {
        streamDispatch(streamActions.setTrackFavorite(content.id, r));
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

  const handleAddToQueue = () => {
    handleClose();
    if (content.type === 'track') {
      streamDispatch(streamActions.addToQueue([content.id]));
    } else {
      streamCollection(authState.token, content.type, content.id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(streamActions.addToQueue(res.data));
        }
      });
    }
  };

  let AddToQueue = (
    <LinkWhiteColor onClick={handleAddToQueue}>Add to queue</LinkWhiteColor>
  );
  let superprops = {
    elemRef: ref,
    content,
    AddToQueue,
    handlers: {
      handleClose,
      handleToggleFavorite,
      handleAddToQueue
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
