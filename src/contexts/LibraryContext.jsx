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
    case 'DELETE_PLAYLIST':
      return { ...state, ctxDelPlaylistId: action.payload };
    case 'TOGGLE_PLAYLIST_PRIVATE':
      return { ...state, ctxPlaylistPrivate: { ...action.payload } };
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
