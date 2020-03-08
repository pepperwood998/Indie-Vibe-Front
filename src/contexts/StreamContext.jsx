import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState
} from 'react';
import AudioStream from '../utils/AudioStream';
import { getTrackInfo, getTrackStream } from '../apis/API';
import { AuthContext } from './AuthContext';

const StreamContext = createContext();

const stream = new AudioStream();

const initState = {
  queue: ['g862fcs7osqy0apqx40k', 'skierp4k152acn129gcx'],
  shuffle: [],
  currentSong: 0,
  bitrate: 0,
  playType: '', // 'playlist' or 'release'
  collectionId: ''
};

function StreamContextProvider(props) {
  const [init, setInit] = useState(false);
  const [state, dispatch] = useReducer(reducer, initState);

  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    if (!init) {
      stream.init(
        id => {
          return getTrackInfo(authState.token, id);
        },
        (id, start, end) => {
          return getTrackStream(authState.token, id, start, end);
        }
      );
      setInit(true);
    }
  });

  return (
    <StreamContext.Provider value={{ state, actions, dispatch, stream }}>
      {props.children}
    </StreamContext.Provider>
  );
}

const actions = {
  somePlay: () => {
    return {
      type: 'SOME_PLAY'
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
  togglePlay: () => {
    return {
      type: 'TOGGLE_PLAY'
    };
  },
  seek: per => {
    return {
      type: 'SEEK',
      per
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SOME_PLAY':
      stream.start(state.queue[state.currentSong]);
      return state;
    case 'SKIP_BACKWARD':
      return {
        ...state,
        currentSong: Math.max(state.currentSong - 1, 0)
      };
    case 'SKIP_FORWARD':
      return {
        ...state,
        currentSong: Math.min(state.currentSong + 1, state.queue.length - 1)
      };
    case 'TOGGLE_PLAY':
      stream.togglePlay();
      return state;
    case 'SEEK':
      stream.seek(action.per);
      return state;
    default:
      return state;
  }
};

export { StreamContext };
export default StreamContextProvider;
