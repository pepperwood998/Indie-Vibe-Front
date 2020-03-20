import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AudioStream from '../utils/AudioStream';
import { getStreamInfo } from '../apis/StreamAPI';
import { AuthContext } from './AuthContext';
import { reorder, shuffle } from '../utils/Common';

const StreamContext = createContext();

const stream = new AudioStream();

const initState = {
  queue: ['3AUo1uunXOxigzt6JIsZ', '5UmNONJQaXmNmbdmr2On'],
  queueSrc: [],
  currentSongIndex: 0,
  bitrate: 128,
  playFromId: '',
  playFromType: '', // 'playlist' or 'release' or 'favorite'
  volume: 50,
  muted: false,
  autoplay: false,
  paused: true,
  shuffled: false,
  info: {}
};

function StreamContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState);

  const { state: authState } = useContext(AuthContext);

  // init stream states
  useEffect(() => {
    stream.api = (id, bitrate) => {
      return getStreamInfo(authState.token, id, bitrate);
    };
    stream.onInfo = info => {
      dispatch(actions.setInfo(info));
    };
    stream.onTogglePaused = paused => {
      dispatch(actions.onTogglePaused(paused));
    };
    stream.onEnded = () => {
      // testing
      // repeat current song
      dispatch(actions.repeatTrack());
    };
  }, []);

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
  start: (queue, playFromType, playFromId) => {
    return {
      type: 'START',
      payload: {
        queue,
        playFromType,
        playFromId
      }
    };
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
  skipBackward: () => {
    return {
      type: 'SKIP_BACKWARD'
    };
  },
  skipForward: () => {
    return {
      type: 'SKIP_FORWARD'
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
  setInfo: info => {
    return {
      type: 'SET_INFO',
      info
    };
  },
  clean: () => {
    return { type: 'CLEAN' };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      const { payload } = action;
      stream.init(
        payload.audio,
        payload.onProgress,
        payload.onDurationChange,
        state.autoplay,
        state.bitrate
      );
      return state;
    case 'START':
      stream.start(action.payload.queue[0]);
      return {
        ...state,
        ...action.payload,
        queueSrc: action.payload.queue
      };
    case 'REPEAT_TRACK':
      stream.start(state.queue[state.currentSongIndex]);
      return state;
    case 'REORDER':
      let queue = reorder(state.queue, state.queue.indexOf(action.trackId));
      if (state.shuffled) {
        queue = [queue[0], ...shuffle(queue.slice(1))];
      }
      return {
        ...state,
        queue,
        currentSongIndex: 0
      };
    case 'SKIP_BACKWARD':
      if (!state.queue.length) return state;

      let index = Math.max(state.currentSongIndex - 1, 0);
      stream.start(state.queue[index]);
      return {
        ...state,
        currentSongIndex: index
      };
    case 'SKIP_FORWARD':
      if (!state.queue.length) return state;

      let ind = Math.min(state.currentSongIndex + 1, state.queue.length - 1);
      stream.start(state.queue[ind]);
      return {
        ...state,
        currentSongIndex: ind
      };
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
    case 'SET_INFO':
      return {
        ...state,
        info: action.info
      };
    case 'CLEAN':
      stream.clean();
      return state;
    default:
      return state;
  }
};

export { StreamContext };
export default StreamContextProvider;
