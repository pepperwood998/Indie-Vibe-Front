import React, { useContext, useEffect, useState } from 'react';
import { getStreamQueue } from '../../../apis/StreamAPI';
import { TrackTable } from '../../../components/collections/track-table';
import { GroupEmpty } from '../../../components/groups';
import { AuthContext, LibraryContext, StreamContext } from '../../../contexts';
import { useEffectSkip } from '../../../utils/Common';

function Queue() {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { state: libState } = useContext(LibraryContext);

  const [tracks, setTracks] = useState([]);
  const [extra, setExtra] = useState({
    offset: 0,
    limit: 20
  });
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    getStreamQueue(
      authState.token,
      streamState.queue
        .map(item => item.id)
        .slice(extra.offset, extra.offset + extra.limit)
    )
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setTracks([...res.data]);
        } else throw res.data;
      })
      .catch(err => {
        setFirstRender(false);
        console.error(err);
      });
  }, []);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    const tracksTmp = [...tracks];
    tracksTmp.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setTracks([...tracksTmp]);
  }, [libState.ctxFav]);

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty
      isEmpty={!streamState.queue.length}
      message='No songs in the play queue'
    >
      <div className='content-page fadein'>
        <div className='play-queue mono-page content-padding'>
          <h3 className='font-short-extra font-white font-weight-bold'>
            PLAY QUEUE
          </h3>
          <TrackTable type='queue' inQueue items={tracks} />
        </div>
      </div>
    </GroupEmpty>
  );
}

export default Queue;
