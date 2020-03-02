import React, { createContext, useEffect, useReducer } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

function AuthContextProvider(props) {
  const initState = {
    id: '',
    role: '',
    token: ''
  };
  const [state, dispatch] = useReducer(reducer, initState, () => {
    let credentials = localStorage.getItem('credentials');
    if (credentials) return JSON.parse(credentials);
    else return initState;
  });

  useEffect(() => {
    localStorage.setItem('credentials', JSON.stringify(state));
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
      let decodedToken = jwt_decode(json['access_token']);
      return {
        ...state,
        token: json['access_token'],
        id: decodedToken['client_id'],
        role: decodedToken['authorities'][0]
      };
    case 'LOGOUT':
      return {
        ...state,
        id: '',
        role: '',
        token: ''
      };
    default:
      return state;
  }
};

export { AuthContext };
export default AuthContextProvider;
