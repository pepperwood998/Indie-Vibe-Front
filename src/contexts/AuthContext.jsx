import React, { createContext, useEffect, useReducer, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getNewToken } from '../apis/AuthAPI';

const AuthContext = createContext();

const initState = {
  id: '',
  role: '',
  token: '',
  refreshToken: '',
  expiry: 0,
  remembered: false,
  lastSessionTime: 0
};

let refresher = null;
function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState, () => {
    let credentials = localStorage.getItem('credentials');
    if (credentials) {
      credentials = JSON.parse(credentials);
      if (credentials['token']) return credentials;
    } else {
      credentials = sessionStorage.getItem('credentials');
      if (credentials) {
        credentials = JSON.parse(credentials);
        if (credentials['token']) return credentials;
      }
    }

    return initState;
  });

  const refreshFunc = () => {
    localStorage.removeItem('lastTimeSession');
    getNewToken(state.refreshToken)
      .then(response => response.json())
      .then(json => {
        let { access_token, refresh_token, expires_in } = json;
        if (access_token) {
          dispatch(
            actions.refreshToken({
              token: access_token,
              refreshToken: refresh_token,
              expiry: expires_in
            })
          );
        } else {
          dispatch(actions.logout());
        }
      });
  };

  useEffect(() => {
    if (state.remembered)
      localStorage.setItem('credentials', JSON.stringify(state));
    else {
      sessionStorage.setItem('credentials', JSON.stringify(state));
    }

    if (state.token) {
      clearTimeout(refresher);
      let lastTimeSession = localStorage.getItem('lastTimeSession');
      let btw = 0;
      if (lastTimeSession) {
        btw = Date.now() - parseInt(lastTimeSession);
      } else {
        localStorage.setItem('lastTimeSession', Date.now().toString());
      }
      refresher = setTimeout(refreshFunc, (state.expiry * 1000 - btw) * 0.8);
      // refresher = setTimeout(refreshFunc, 5000);
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, actions, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}

const actions = {
  loginSuccess: payload => {
    return {
      type: 'LOGIN_SUCCESS',
      payload
    };
  },
  logout: () => {
    return {
      type: 'LOGOUT'
    };
  },
  refreshToken: payload => {
    return {
      type: 'REFRESH_TOKEN',
      payload
    };
  },
  setLastSessionTime: () => {
    return {
      type: 'SET_LAST_SESSION_TIME'
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      let { payload } = action;
      let decodedToken;
      try {
        decodedToken = jwt_decode(payload['access_token']);
      } catch (err) {
        return {
          ...state,
          ...initState
        };
      }
      return {
        ...state,
        id: decodedToken['user'],
        role: decodedToken['authorities'][0],
        token: payload['access_token'],
        refreshToken: payload['refresh_token'],
        expiry: payload['expires_in'],
        remembered: payload.remembered
      };
    case 'LOGOUT':
      clearTimeout(refresher);
      localStorage.removeItem('lastTimeSession');
      localStorage.removeItem('credentials');
      sessionStorage.removeItem('credentials');
      sessionStorage.removeItem('me');
      return {
        ...state,
        ...initState
      };
    case 'REFRESH_TOKEN': {
      const { payload } = action;
      let decodedToken;
      try {
        decodedToken = jwt_decode(payload['token']);
      } catch (err) {
        clearTimeout(refresher);
        localStorage.removeItem('lastTimeSession');
        localStorage.removeItem('credentials');
        sessionStorage.removeItem('credentials');
        sessionStorage.removeItem('me');
        return {
          ...state,
          ...initState
        };
      }
      return {
        ...state,
        ...payload,
        role: decodedToken['authorities'][0]
      };
    }
    case 'SET_LAST_SESSION_TIME':
      return {
        ...state,
        lastSessionTime: Date.now()
      };
    default:
      return state;
  }
};

export { AuthContext };
export default AuthContextProvider;
