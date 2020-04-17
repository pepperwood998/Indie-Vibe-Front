import React, { useContext } from 'react';
import { streamCollection } from '../../../apis/StreamAPI';
import { PauseIcon, PlayIcon } from '../../../assets/svgs';
import { AuthContext, StreamContext } from '../../../contexts';
import { ButtonIcon } from '../../buttons';

function CellAction({
  id = '',
  serial = 1,
  playFromId = '',
  playFromType = '',
  inQueue = false
}) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const queueCurrItem = streamState.queue[streamState.currentSongIndex];
  const current = queueCurrItem ? queueCurrItem.id : null;
  const currentFrom = queueCurrItem ? queueCurrItem.from : null;
  let isCurrent = false;
  if (inQueue) {
    isCurrent = serial - 1 === streamState.currentSongIndex;
  } else {
    isCurrent =
      id === current &&
      playFromType === streamState.playFromType &&
      playFromId === streamState.playFromId &&
      currentFrom === streamState.playFromType;
  }

  const handlePause = () => {
    streamDispatch(streamAction.togglePaused(true));
  };
  const handlePlay = () => {
    if (isCurrent) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      if (
        playFromId === streamState.playFromId &&
        playFromType === streamState.playFromType &&
        streamState.queue.findIndex(item => item.id === id) != -1
      ) {
        streamDispatch(streamAction.reorder(id));
      } else {
        streamCollection(authState.token, playFromType, playFromId)
          .then(res => {
            if (res.status === 'success' && res.data.length) {
              streamDispatch(
                streamAction.start(res.data, playFromType, playFromId, id)
              );
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  };

  const handlePlayInQueue = () => {
    if (serial - 1 === streamState.currentSongIndex) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      streamDispatch(streamAction.playInQueue(serial - 1));
    }
  };

  let classes = 'action center side';
  classes += isCurrent ? ' active' : '';
  return (
    <div className={classes}>
      <span className='serial ellipsis one-line'>{serial}</span>
      <div className='control'>
        <ButtonIcon>
          {isCurrent && !streamState.paused ? (
            <PauseIcon onClick={handlePause} />
          ) : (
            <PlayIcon onClick={inQueue ? handlePlayInQueue : handlePlay} />
          )}
        </ButtonIcon>
      </div>
    </div>
  );
}

export default CellAction;
