import React, { useContext, useEffect, useState } from 'react';
import { getTrackFull } from '../../../apis/API';
import { getStreamQueue } from '../../../apis/StreamAPI';
import { ButtonLoadMore } from '../../../components/buttons';
import { TrackTable } from '../../../components/collections/track-table';
import { GroupEmpty } from '../../../components/groups';
import usePageTitle from '../../../components/hooks/HookPageTitle';
import { AuthContext, LibraryContext, StreamContext } from '../../../contexts';
import { subarr, swapOrigin, useEffectSkip } from '../../../utils/Common';

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
      subarr(
        streamState.queue.map(item => item.id),
        extra.offset,
        extra.limit
      )
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

  usePageTitle('Play Queue', true);

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

  useEffectSkip(() => {
    const tracksTemp = [...tracks];
    streamState.queue.forEach((item, index) => {
      let queueId = item.id;
      let tracksIndex = tracksTemp
        .slice(index)
        .findIndex(elem => elem.id === queueId);

      if (tracksIndex >= 0) swapOrigin(tracksTemp, index, tracksIndex + index);
    });

    setTracks(tracksTemp);
  }, [streamState.shuffled]);

  // effect-skip: remove from queue
  useEffectSkip(() => {
    setTracks(tracks.filter((item, i) => i !== streamState.rmQueue.index));
  }, [streamState.rmQueue]);

  useEffectSkip(() => {
    getTrackFull(authState.token, streamState.addQueue.id)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const tracksTmp = [...tracks];
          tracksTmp.splice(streamState.currentSongIndex + 1, 0, {
            ...res.data
          });

          setTracks(tracksTmp);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [streamState.addQueue]);

  const handleLoadMore = () => {
    getStreamQueue(
      authState.token,
      subarr(
        streamState.queue.map(item => item.id),
        extra.offset + extra.limit,
        extra.limit
      )
    )
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setTracks([...tracks, ...res.data]);
          setExtra({ ...extra, offset: extra.offset + extra.limit });
        } else throw res.data;
      })
      .catch(err => {
        setFirstRender(false);
        console.error(err);
      });
  };

  return firstRender ? (
    <div className='content-page fadein'>
      <div className='play-queue mono-page content-padding'>
        <h3 className='font-short-extra font-white font-weight-bold'>
          PLAY QUEUE
        </h3>
        <TrackTable loading={true} />
      </div>
    </div>
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
          {streamState.queue.length > extra.offset + extra.limit ? (
            <ButtonLoadMore onClick={handleLoadMore}>
              More in Queue
            </ButtonLoadMore>
          ) : (
            ''
          )}
        </div>
      </div>
    </GroupEmpty>
  );
}

export default Queue;
