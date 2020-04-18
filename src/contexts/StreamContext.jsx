import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { streamCount } from '../apis/API';
import { getStreamInfo } from '../apis/StreamAPI';
import AudioStream from '../utils/AudioStream';
import { getCircularIndex, reorder, shuffle, swap } from '../utils/Common';
import { AuthContext } from './AuthContext';
import { LibraryContext } from './LibraryContext';
import { MeContext } from './MeContext';

const StreamContext = createContext();

const stream = new AudioStream();

const initState = {
  queue: [],
  queueSrc: [],
  currentSongIndex: -1,
  playFromId: '',
  playFromType: '', // 'playlist' or 'release' or 'favorite'
  collectionRecorded: false,
  info: {},
  volume: 50,
  muted: false,
  paused: true,
  repeat: 'none',
  shuffled: false,
  settings: {
    bitrate: '128',
    shouldPlay: false
  },
  skipStatus: {
    count: 0,
    quota: 6
  },
  loading: false,
  rmQueue: {
    index: -1
  },
  addQueue: {
    id: ''
  }
};

let skipFailCb = () => undefined;
function StreamContextProvider(props) {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );
  const [state, dispatch] = useReducer(reducer, initState, () => {
    let settings = localStorage.getItem('settings');
    if (settings) {
      settings = JSON.parse(settings);
      if (authState.role === 'r-free') {
        settings.bitrate = '128';
        localStorage.setItem('settings', settings);
      }
      return {
        ...initState,
        settings
      };
    }

    return initState;
  });

  const { role } = useContext(MeContext).state;

  skipFailCb = () => {
    libDispatch(libActions.setNotification(true, false, 'Reach maximum skips'));
  };

  // init stream states
  useEffect(() => {
    stream.onInfo = info => {
      dispatch(actions.setInfo(info));
    };
    stream.onLoadStart = () => {
      dispatch(actions.setLoading(true));
    };
    stream.onLoaded = () => {
      dispatch(actions.setLoading(false));
    };
    stream.onTogglePaused = paused => {
      dispatch(actions.onTogglePaused(paused));
    };
    if (state.settings)
      localStorage.setItem('settings', JSON.stringify(state.settings));
  }, []);

  useEffect(() => {
    stream.api = (id, bitrate) => {
      return getStreamInfo(authState.token, id, bitrate);
    };
  }, [authState.token]);

  useEffect(() => {
    stream.onRecorded = trackId => {
      streamCount(authState.token, 'track', trackId);
      console.log('stream:', 'track', trackId);
      if (
        !state.collectionRecorded &&
        state.playFromType &&
        state.playFromType !== 'favorite' &&
        state.playFromType !== 'artist'
      ) {
        console.log('stream:', 'from', state.playFromType, state.playFromId);
        dispatch(actions.recordCollection());
        streamCount(authState.token, state.playFromType, state.playFromId);
      }
    };
  }, [authState.token, state.playFromId, state.collectionRecorded]);

  //
  useEffect(() => {
    stream.onEnded = () => {
      switch (state.repeat) {
        case 'none':
          if (state.currentSongIndex < state.queue.length - 1) {
            dispatch(actions.skipForward(role.id, true, false));
          }
          break;
        case 'one':
          dispatch(actions.repeatTrack());
          break;
        case 'all':
          dispatch(actions.skipForward(role.id, true, false));
          break;
        default:
      }
    };
  }, [state.currentSongIndex, state.repeat, state.queue]);

  useEffect(() => {
    let resetSkipQuota;
    const { skipStatus } = state;
    if (skipStatus.count >= skipStatus.quota) {
      resetSkipQuota = setTimeout(() => {
        dispatch(actions.resetSkipQuota());
      }, 5 * 1000);
    }

    return () => {
      clearTimeout(resetSkipQuota);
    };
  }, [state.skipStatus]);

  return (
    <StreamContext.Provider value={{ state, actions, dispatch, stream }}>
      {props.children}
    </StreamContext.Provider>
  );
}

const actions = {
  init: payload => {
    return {
      type: 'INIT',
      payload
    };
  },
  start: (queue = [], playFromType, playFromId, targetTrackId) => {
    return {
      type: 'START',
      payload: {
        queue,
        playFromType,
        playFromId,
        targetTrackId
      }
    };
  },
  setLoading: loading => {
    return { type: 'SET_LOADING', loading };
  },
  addToQueue: (extra = []) => {
    return {
      type: 'ADD_TO_QUEUE',
      extra
    };
  },
  removeFromQueue: index => {
    return {
      type: 'RM_FROM_QUEUE',
      index
    };
  },
  playInQueue: index => {
    return { type: 'PLAY_IN_QUEUE', index };
  },
  repeatTrack: () => {
    return { type: 'REPEAT_TRACK' };
  },
  reorder: trackId => {
    return {
      type: 'REORDER',
      trackId
    };
  },
  skipBackward: (role, autoplay = false, mannual = true) => {
    return {
      type: 'SKIP',
      payload: { role, autoplay, mannual, type: 'backward' }
    };
  },
  skipForward: (role, autoplay = false, mannual = true) => {
    return {
      type: 'SKIP',
      payload: { role, autoplay, mannual, type: 'forward' }
    };
  },
  togglePaused: () => {
    return {
      type: 'TOGGLE_PAUSED'
    };
  },
  onTogglePaused: paused => {
    return {
      type: 'ON_TOGGLE_PAUSED',
      paused
    };
  },
  seek: per => {
    return {
      type: 'SEEK',
      per
    };
  },
  volume: per => {
    return {
      type: 'VOLUME',
      per
    };
  },
  setMuted: muted => {
    return {
      type: 'SET_MUTED',
      muted
    };
  },
  setRepeat: repeat => {
    return {
      type: 'SET_REPEAT',
      repeat
    };
  },
  setShuffle: shuffled => {
    return {
      type: 'SET_SHUFFLE',
      shuffled
    };
  },
  setInfo: info => {
    return {
      type: 'SET_INFO',
      info
    };
  },
  clean: () => {
    return { type: 'CLEAN' };
  },
  setTrackFavorite: (id, relation) => {
    return {
      type: 'SET_TRACK_FAVORITE',
      payload: {
        id,
        relation
      }
    };
  },
  setSettings: settings => {
    return { type: 'SET_SETTINGS', settings };
  },
  recordCollection: () => {
    return { type: 'RECORD_COLLECTION' };
  },
  resetSkipQuota: () => {
    return { type: 'RESET_SKIP_QUOTA' };
  }
};

const reducer = (state = { ...initState }, action) => {
  switch (action.type) {
    case 'INIT': {
      let { payload } = action;
      stream.init(
        payload.audio,
        payload.onProgress,
        payload.onDurationChange,
        state.settings,
        payload.onError
      );
      return state;
    }
    case 'START': {
      let { payload } = action;
      if (!payload.queue.length) return state;

      let queue = payload.queue.map(item => ({
        id: item,
        from: payload.playFromType
      }));
      if (payload.targetTrackId) {
        queue = reorder(
          queue,
          queue.findIndex(item => payload.targetTrackId === item.id)
        );
      }
      stream.continue(queue[0].id, true);
      return {
        ...state,
        queue: [...queue],
        queueSrc: [...queue],
        playFromType: payload.playFromType,
        playFromId: payload.playFromId,
        collectionRecorded: false,
        currentSongIndex: 0
      };
    }
    case 'SET_LOADING': {
      return { ...state, loading: action.loading };
    }
    case 'ADD_TO_QUEUE': {
      if (!action.extra.length) return state;

      let newState = {};
      let extra = action.extra.map(item => ({ id: item, from: 'queue' }));
      let queueSrc = [...state.queueSrc];
      if (!queueSrc.length) {
        stream.start(action.extra[0], stream.settings.shouldPlay);
        newState.currentSongIndex = 0;
      }
      queueSrc.splice(state.currentSongIndex + 1, 0, ...extra);

      if (state.shuffled) {
        let queue = [...state.queue];
        queue.splice(state.currentSongIndex + 1, 0, ...extra);
        newState = {
          ...newState,
          queue: [...queue],
          queueSrc: [...queueSrc]
        };
      } else {
        newState = {
          ...newState,
          queue: [...queueSrc],
          queueSrc: [...queueSrc]
        };
      }

      return {
        ...state,
        ...newState,
        addQueue: {
          id: action.extra[0]
        }
      };
    }
    case 'RM_FROM_QUEUE': {
      if (action.index === state.currentSongIndex) return state;

      const queueTmp = [...state.queue];
      const queueSrcTmp = [...state.queueSrc];

      let rmId = queueTmp[action.index].id;
      let rmSrcInd = queueSrcTmp.findIndex(item => rmId === item.id);
      queueSrcTmp.splice(rmSrcInd, 1);
      return {
        ...state,
        queue: queueTmp.filter((item, i) => i !== action.index),
        queueSrc: [...queueSrcTmp],
        rmQueue: {
          index: action.index
        }
      };
    }
    case 'PLAY_IN_QUEUE': {
      stream.continue(state.queue[action.index].id);
      return {
        ...state,
        currentSongIndex: action.index
      };
    }
    case 'REPEAT_TRACK': {
      stream.replay();
      return state;
    }
    case 'REORDER': {
      let targetIndex = state.queue.findIndex(
        item => action.trackId === item.id
      );
      let queue = swap(state.queue, state.currentSongIndex, targetIndex);
      stream.continue(queue[state.currentSongIndex].id);
      return {
        ...state,
        queue: [...queue]
      };
    }
    case 'SKIP': {
      const { queue } = state;
      if (!queue.length) return state;
      if (queue.length === 1) {
        stream.replay();
        return state;
      }

      const { role, autoplay, mannual, type } = action.payload;
      const { skipStatus } = state;
      if (role === 'r-free' && skipStatus.count >= skipStatus.quota) {
        skipFailCb();
        return state;
      }

      let shouldPlay = !state.paused;
      // when reachs the end of the song
      if (!shouldPlay) {
        shouldPlay = autoplay;
      }

      let skipIndex = getCircularIndex(
        type === 'forward'
          ? state.currentSongIndex + 1
          : state.currentSongIndex - 1,
        queue.length
      );
      stream.start(queue[skipIndex].id, shouldPlay);

      return mannual && role === 'r-free'
        ? {
            ...state,
            skipStatus: { ...skipStatus, count: skipStatus.count + 1 },
            currentSongIndex: skipIndex
          }
        : {
            ...state,
            currentSongIndex: skipIndex
          };
    }
    case 'TOGGLE_PAUSED':
      stream.togglePaused();
      return state;
    case 'ON_TOGGLE_PAUSED':
      return {
        ...state,
        paused: action.paused
      };
    case 'SEEK':
      stream.seek(action.per);
      return state;
    case 'VOLUME':
      const { per: volume } = action;
      stream.volume(volume);
      stream.toggleMute(false);
      if (volume !== 0) return { ...state, volume, muted: false };
      else return { ...state, muted: true };
    case 'SET_MUTED':
      const { muted } = action;
      if (!muted) stream.volume(state.volume);
      stream.toggleMute(muted);
      return { ...state, muted };
    case 'SET_REPEAT':
      return { ...state, repeat: action.repeat };
    case 'SET_SHUFFLE':
      const { queue, queueSrc, currentSongIndex } = state;
      if (!queue.length) return state;

      let { shuffled } = action;
      if (shuffled) {
        let queueTmp = reorder(queue, currentSongIndex);
        queueTmp = [queueTmp[0], ...shuffle(queueTmp.slice(1))];
        return { ...state, queue: queueTmp, currentSongIndex: 0, shuffled };
      } else {
        let originalInd = queueSrc.findIndex(
          item => queue[currentSongIndex].id === item.id
        );
        return {
          ...state,
          queue: [...state.queueSrc],
          currentSongIndex: originalInd,
          shuffled
        };
      }
    case 'SET_INFO':
      return {
        ...state,
        info: action.info
      };
    case 'CLEAN':
      stream.clean();
      return state;
    case 'SET_TRACK_FAVORITE': {
      const { payload } = action;
      if (state.info.id === payload.id) {
        return {
          ...state,
          info: {
            ...state.info,
            relation: payload.relation
          }
        };
      }

      return state;
    }
    case 'SET_SETTINGS': {
      stream.setSettings(action.settings);
      let newSettings = { ...state.settings, ...action.settings };
      localStorage.setItem('settings', JSON.stringify(newSettings));
      return { ...state, settings: newSettings };
    }
    case 'RECORD_COLLECTION': {
      return { ...state, collectionRecorded: true };
    }
    case 'RESET_SKIP_QUOTA': {
      return { ...state, skipStatus: { ...state.skipStatus, count: 0 } };
    }
    default:
      return state;
  }
};

export { StreamContext };
export default StreamContextProvider;
