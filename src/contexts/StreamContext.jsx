import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState
} from 'react';
import AudioStream from '../utils/AudioStream';
import { getStreamInfo, getStream } from '../apis/API';
import { AuthContext } from './AuthContext';

const StreamContext = createContext();

const stream = new AudioStream();

const initState = {
  queue: ['g862fcs7osqy0apqx40k', 'skierp4k152acn129gcx'],
  shuffle: [],
  currentSong: 0,
  bitrate: 128,
  playType: 'release', // 'playlist' or 'release'
  collectionId: '',
  volume: 50,
  muted: false,
  autoplay: false,
  paused: true,
  info: {}
};

function StreamContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState);

  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    stream.init(
      (id, bitrate) => {
        return getStreamInfo(authState.token, id, bitrate);
      },
      (id, bitrate, start, end) => {
        return getStream(authState.token, id, bitrate, start, end);
      },
      paused => {
        dispatch(actions.setPaused(paused));
      },
      state.autoplay,
      state.bitrate
    );

    stream.onInfo = info => {
      console.log(info);
      dispatch(actions.setInfo(info));
    };
  }, []);

  return (
    <StreamContext.Provider value={{ state, actions, dispatch, stream }}>
      {props.children}
    </StreamContext.Provider>
  );
}

const actions = {
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
    case 'SKIP_BACKWARD':
      let index = Math.max(state.currentSong - 1, 0);
      stream.start(state.queue[index]);
      return {
        ...state,
        currentSong: index
      };
    case 'SKIP_FORWARD':
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
