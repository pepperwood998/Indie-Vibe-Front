import React, { createContext, useReducer, useEffect } from 'react';

const LibraryContext = createContext();

const initState = {
  ctxMenuElem: null,
  ctxMenuOpened: false,
  ctxMenuContent: {},
  ctxMenuPos: [0, 0],
  ctxFav: { id: '', type: '', relation: [] },
  ctxDelPlaylistId: '',
  ctxPlaylistPrivate: { id: '', status: '' },
  ctxDelPlaylistTrackId: '',
  myPlaylists: {
    items: [],
    offset: 0,
    limit: 0,
    total: 0
  },
  browsePlaylists: {
    opened: false,
    trackId: ''
  },
  editPlaylist: {
    opened: false,
    type: 'create',
    playlist: {}
  },
  notification: {
    opened: false,
    success: false,
    message: ''
  }
};

const actions = {
  initCtxElem: payload => {
    return {
      type: 'INIT_CTX_ELEM',
      payload
    };
  },
  openCtxMenu: payload => {
    return {
      type: 'OPEN_CTX_MENU',
      payload
    };
  },
  updateCtxPos: payload => {
    return {
      type: 'UPDATE_CTX_POS',
      payload
    };
  },
  closeCtxMenu: () => {
    return { type: 'CLOSE_CTX_MENU' };
  },
  toggleFavorite: payload => {
    return { type: 'TOGGLE_FAV', payload };
  },
  deletePlaylist: payload => {
    return { type: 'DELETE_PLAYLIST', payload };
  },
  togglePlaylistPrivate: payload => {
    return { type: 'TOGGLE_PLAYLIST_PRIVATE', payload };
  },
  setMyPlaylists: payload => {
    return { type: 'SET_MY_PLAYLISTS', payload };
  },
  createPlaylist: payload => {
    return { type: 'CREATE_PLAYLIST', payload };
  },
  loadMorePlaylists: payload => {
    return { type: 'LOAD_MORE_PLAYLISTS', payload };
  },
  setBrowsePlaylists: (opened, trackId) => {
    return {
      type: 'SET_BROWSE_PLAYLISTS',
      payload: { opened, trackId }
    };
  },
  setEditPlaylist: (opened, type = 'create', playlist = {}) => {
    return {
      type: 'SET_EDIT_PLAYLIST',
      payload: { opened, type, playlist }
    };
  },
  addTrackToPlaylist: playlistId => {
    return { type: 'ADD_TRACK_PLAYLIST', playlistId };
  },
  removeTrackFromPlaylist: (playlistId, trackId) => {
    return { type: 'RM_TRACK_PLAYLIST', payload: { playlistId, trackId } };
  },
  setNotification: (opened, success = false, message = '') => {
    return {
      type: 'SET_NOTIFICATION',
      payload: {
        opened,
        success,
        message
      }
    };
  }
};

let handleClosed = e => undefined;
const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT_CTX_ELEM':
      return {
        ...state,
        ctxMenuElem: action.payload
      };
    case 'OPEN_CTX_MENU':
      return {
        ...state,
        ctxMenuOpened: true,
        ctxMenuContent: { ...action.payload.content },
        ctxMenuPos: [...action.payload.pos]
      };
    case 'UPDATE_CTX_POS':
      return { ...state, ctxMenuPos: [...action.payload] };
    case 'CLOSE_CTX_MENU':
      document.removeEventListener('click', handleClosed);
      return {
        ...state,
        ctxMenuOpened: false,
        ctxMenuContent: {},
        ctxMenuPos: [0, 0]
      };
    case 'TOGGLE_FAV':
      return { ...state, ctxFav: { ...action.payload } };
    case 'DELETE_PLAYLIST': {
      const { myPlaylists } = state;
      return {
        ...state,
        ctxDelPlaylistId: action.payload,
        myPlaylists: {
          ...myPlaylists,
          items: myPlaylists.items.filter(item => item.id !== action.payload),
          total: myPlaylists.total - 1
        }
      };
    }
    case 'TOGGLE_PLAYLIST_PRIVATE':
      return { ...state, ctxPlaylistPrivate: action.payload };
    case 'SET_MY_PLAYLISTS':
      return { ...state, myPlaylists: { ...action.payload } };
    case 'CREATE_PLAYLIST': {
      const { myPlaylists } = state;
      return {
        ...state,
        myPlaylists: {
          ...myPlaylists,
          items: [...myPlaylists.items, action.payload],
          total: myPlaylists.total + 1
        }
      };
    }
    case 'LOAD_MORE_PLAYLISTS': {
      const { myPlaylists } = state;
      return {
        ...state,
        myPlaylists: {
          ...myPlaylists,
          items: [...myPlaylists.items, ...action.payload.items],
          offset: action.payload.offset,
          limit: action.payload.limit,
          total: action.payload.total
        }
      };
    }
    case 'SET_BROWSE_PLAYLISTS': {
      return {
        ...state,
        browsePlaylists: action.payload
      };
    }
    case 'SET_EDIT_PLAYLIST': {
      return {
        ...state,
        editPlaylist: action.payload
      };
    }
    case 'ADD_TRACK_PLAYLIST': {
      const playlists = [...state.myPlaylists.items];
      playlists.some(item => {
        if (action.playlistId === item.id) {
          item.tracksCount += 1;
          return true;
        }
      });
      return {
        ...state,
        myPlaylists: {
          ...state.myPlaylists,
          items: playlists
        }
      };
    }
    case 'RM_TRACK_PLAYLIST': {
      const { payload } = action;
      const playlists = [...state.myPlaylists.items];
      playlists.some(item => {
        if (payload.playlistId === item.id) {
          item.tracksCount -= 1;
          return true;
        }
      });
      return {
        ...state,
        ctxDelPlaylistTrackId: action.payload.trackId,
        myPlaylists: {
          ...state.myPlaylists,
          items: playlists
        }
      };
    }
    case 'SET_NOTIFICATION': {
      return {
        ...state,
        notification: action.payload
      };
    }
    default:
      return state;
  }
};

function LibraryContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (state.ctxMenuOpened) {
      handleClosed = e => {
        if (state.ctxMenuElem && !state.ctxMenuElem.contains(e.target)) {
          dispatch(actions.closeCtxMenu());
        }
      };
      document.addEventListener('click', handleClosed);
    }
  }, [state.ctxMenuOpened]);

  useEffect(() => {
    dispatch(actions.closeCtxMenu());
  }, [state.ctxFav]);

  return (
    <LibraryContext.Provider value={{ state, actions, dispatch }}>
      {props.children}
    </LibraryContext.Provider>
  );
}

export { LibraryContext };
export default LibraryContextProvider;
