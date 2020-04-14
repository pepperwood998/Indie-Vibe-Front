import React, { useContext } from 'react';
import { streamCollection } from '../../../apis/StreamAPI';
import { PauseIcon, PlayIcon } from '../../../assets/svgs';
import { AuthContext, StreamContext } from '../../../contexts';
import { ButtonIcon } from '../../buttons';

function CellAction(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const current =
    streamState.currentSongIndex >= 0
      ? streamState.queue[streamState.currentSongIndex].id
      : null;
  const { serial, id, playFromId, playFromType } = props;

  const handlePause = () => {
    streamDispatch(streamAction.togglePaused(true));
  };
  const handlePlay = () => {
    if (id === current && playFromId === streamState.playFromId) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      if (playFromId === streamState.playFromId) {
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

  let isCurrent =
    id === current &&
    playFromType === streamState.playFromType &&
    playFromId === streamState.playFromId;
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
            <PlayIcon onClick={handlePlay} />
          )}
        </ButtonIcon>
      </div>
    </div>
  );
}

export default CellAction;
