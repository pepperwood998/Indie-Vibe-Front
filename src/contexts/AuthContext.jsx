import React, { createContext, useEffect, useReducer } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const initState = {
  id: '',
  role: '',
  token: '',
  remembered: false
};

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

  useEffect(() => {
    if (state.remembered)
      localStorage.setItem('credentials', JSON.stringify(state));
    else {
      sessionStorage.setItem('credentials', JSON.stringify(state));
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
      json: { ...payload }
    };
  },
  logout: () => {
    return {
      type: 'LOGOUT'
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      let { json } = action;
      let decodedToken;
      try {
        decodedToken = jwt_decode(json['access_token']);
      } catch (err) {
        return {
          ...state,
          ...initState
        };
      }
      return {
        ...state,
        token: json['access_token'],
        id: decodedToken['client_id'],
        role: decodedToken['authorities'][0],
        remembered: json.remembered
      };
    case 'LOGOUT':
      localStorage.removeItem('credentials');
      sessionStorage.removeItem('credentials');
      sessionStorage.removeItem('me');
      return {
        ...state,
        ...initState
      };
    default:
      return state;
  }
};

export { AuthContext };
export default AuthContextProvider;
