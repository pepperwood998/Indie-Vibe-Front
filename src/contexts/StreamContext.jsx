import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AudioStream from '../utils/AudioStream';
import { getStreamInfo, getStream } from '../apis/StreamAPI';
import { AuthContext } from './AuthContext';
import { reorder, shuffle } from '../utils/Common';

const StreamContext = createContext();

const stream = new AudioStream();

const initState = {
  queue: [],
  queueSrc: [],
  currentSong: 0,
  bitrate: 128,
  playType: '', // 'playlist' or 'release' or 'favorite'
  collectionId: '',
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
    stream.init(
      paused => {
        dispatch(actions.setPaused(paused));
      },
      state.autoplay,
      state.bitrate
    );

    stream.onInfo = info => {
      dispatch(actions.setInfo(info));
    };
  }, []);

  // refresh stream api
  useEffect(() => {
    stream.refreshApi(
      (id, bitrate) => {
        return getStreamInfo(authState.token, id, bitrate);
      },
      (url, start, end) => {
        return getStream(url, start, end);
      }
    );
  }, [authState]);

  return (
    <StreamContext.Provider value={{ state, actions, dispatch, stream }}>
      {props.children}
    </StreamContext.Provider>
  );
}

const actions = {
  start: payload => {
    return {
      type: 'START',
      payload
    };
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
  requestPaused: paused => {
    return {
      type: 'REQUEST_PAUSED',
      paused
    };
  },
  setPaused: paused => {
    return {
      type: 'SET_PAUSED',
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
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START':
      stream.start(action.payload.queue[0]);
      return {
        ...state,
        ...action.payload
      };
    case 'REORDER':
      let queue = reorder(state.queue, state.queue.indexOf(action.trackId));
      if (state.shuffled) {
        queue = [queue[0], ...shuffle(queue.slice(1))];
      }
      return {
        ...state,
        queue,
        currentSong: 0
      };
    case 'SKIP_BACKWARD':
      if (!state.queue.length) return state;

      let index = Math.max(state.currentSong - 1, 0);
      stream.start(state.queue[index]);
      return {
        ...state,
        currentSong: index
      };
    case 'SKIP_FORWARD':
      if (!state.queue.length) return state;

      let ind = Math.min(state.currentSong + 1, state.queue.length - 1);
      stream.start(state.queue[ind]);
      return {
        ...state,
        currentSong: ind
      };
    case 'REQUEST_PAUSED':
      const { paused } = action;
      stream.togglePaused(paused);
      return state;
    case 'SET_PAUSED':
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
    default:
      return state;
  }
};

export { StreamContext };
export default StreamContextProvider;
