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
  remembered: false
};

let refresher = null;
function AuthContextProvider(props) {
  const [init, setInit] = useState(false);
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
          setInit(false);
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
      refresher = setTimeout(refreshFunc, state.expiry * 800);
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
        id: decodedToken['client_id'],
        role: decodedToken['authorities'][0],
        token: payload['access_token'],
        refreshToken: payload['refresh_token'],
        expiry: payload['expires_in'],
        remembered: payload.remembered
      };
    case 'LOGOUT':
      clearTimeout(refresher);
      localStorage.removeItem('credentials');
      sessionStorage.removeItem('credentials');
      sessionStorage.removeItem('me');
      return {
        ...state,
        ...initState
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export { AuthContext };
export default AuthContextProvider;
