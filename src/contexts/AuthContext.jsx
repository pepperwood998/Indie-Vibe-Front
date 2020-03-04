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
    if (credentials) return JSON.parse(credentials);
    else {
      credentials = sessionStorage.getItem('credentials');
      if (credentials) return JSON.parse(credentials);
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

  const actions = {
    loginSuccess: payload => {
      return {
        type: 'LOGIN_SUCCESS',
        json: { ...payload }
      };
    }
  };

  return (
    <AuthContext.Provider value={{ state, actions, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      let { json } = action;
      console.log(json);
      let decodedToken;
      try {
        decodedToken = jwt_decode(json['access_token']);
      } catch (err) {
        return {};
      }
      return {
        ...state,
        token: json['access_token'],
        id: decodedToken['client_id'],
        role: decodedToken['authorities'][0],
        remembered: json.remembered
      };
    case 'LOGOUT':
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
