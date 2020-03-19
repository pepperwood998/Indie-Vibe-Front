import React, { createContext, useReducer, useEffect } from 'react';

const LibraryContext = createContext();

const initState = {
  ctxMenuElem: null,
  ctxMenuOpened: false,
  ctxMenuContent: {},
  ctxMenuPos: [0, 0],
  ctxHandleToggleFavorite: action => undefined
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
  closeCtxMenu: () => {
    return { type: 'CLOSE_CTX_MENU' };
  },
  toggleCtxFavorite: payload => {
    return { type: 'TOGGLE_CTX_FAV', payload };
  }
};

let handleClosed = e => undefined;
let toggleFavorite = action => undefined;
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
        ctxMenuPos: [...action.payload.pos],
        ctxHandleToggleFavorite: action.payload.handleToggleFavorite
      };
    case 'CLOSE_CTX_MENU':
      document.removeEventListener('click', handleClosed);
      return {
        ...state,
        ctxMenuOpened: false,
        ctxMenuContent: {},
        ctxMenuPos: [0, 0],
        ctxHandleToggleFavorite: action => undefined
      };
    case 'TOGGLE_CTX_FAV':
      toggleFavorite(action.payload);
      return state;
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
      toggleFavorite = action => {
        state.ctxHandleToggleFavorite(action);
        dispatch(actions.closeCtxMenu());
      };
      document.addEventListener('click', handleClosed);
    }
  }, [state]);

  return (
    <LibraryContext.Provider value={{ state, actions, dispatch }}>
      {props.children}
    </LibraryContext.Provider>
  );
}

export { LibraryContext };
export default LibraryContextProvider;
