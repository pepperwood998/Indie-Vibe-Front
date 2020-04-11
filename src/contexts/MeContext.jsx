import React, { createContext, useEffect, useReducer } from 'react';

const MeContext = createContext();

const initState = {
  id: '',
  displayName: '',
  thumbnail: '',
  followersCount: 0,
  role: {},
  email: '',
  fbId: '',
  gender: 0,
  dob: '',
  artistStatus: '',
  userPlan: {}
};

function MeContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState, () => {
    let me = localStorage.getItem('me');
    return me ? JSON.parse(me) : initState;
  });

  useEffect(() => {
    localStorage.setItem('me', JSON.stringify(state));
  }, [state]);

  return (
    <MeContext.Provider value={{ state, actions, dispatch }}>
      {props.children}
    </MeContext.Provider>
  );
}

const actions = {
  loadMe: payload => {
    return {
      type: 'LOAD_ME',
      json: { ...payload }
    };
  },

  unloadMe: () => {
    return {
      type: 'UNLOAD_ME'
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_ME':
      let { json } = action;
      return {
        ...state,
        ...json
      };
    case 'UNLOAD_ME':
      return {
        ...state,
        ...initState
      };
  }
};

export { MeContext };
export default MeContextProvider;
